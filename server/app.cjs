const express=require('express'),helmet=require('helmet'),cors=require('cors'),{rateLimit}=require('express-rate-limit'),jwt=require('jsonwebtoken'),bcrypt=require('bcryptjs'),crypto=require('node:crypto'),path=require('node:path');
const sessionAuth=require('./session-auth.cjs'),{parseOrigins,sameOrigin}=require('./origins.cjs');
const {sqliteStorage}=require('./storage.cjs'),{createMailer}=require('./mail.cjs'),{validProgress}=require('./validation.cjs');
function createApp(options={}){
 const config=options.config||process.env,secret=config.JWT_SECRET;if(typeof secret!=='string'||secret.length<32)throw new Error('JWT_SECRET phải có ít nhất 32 ký tự ngẫu nhiên.');
 const db=options.db?.asyncStorage?options.db:sqliteStorage(options.db),sendMail=options.sendMail||createMailer(config.RESEND_API_KEY,config.EMAIL_FROM),clock=options.clock||Date.now,app=express();
 if(config.AUTH_LEGACY_UNTIL&&(!Number.isFinite(Date.parse(config.AUTH_LEGACY_UNTIL))||config.NODE_ENV==='production'&&Date.parse(config.AUTH_LEGACY_UNTIL)>Date.now()+7*86400000))throw Error('AUTH_LEGACY_UNTIL phải hợp lệ và không quá 7 ngày trong production.');
 const origins=parseOrigins(config.APP_ORIGINS);app.disable('x-powered-by');const hops=Number(config.TRUST_PROXY_HOPS||0);if(!Number.isInteger(hops)||hops<0||hops>3)throw Error('TRUST_PROXY_HOPS không hợp lệ.');if(config.BEHIND_TRUSTED_PROXY==='true'&&hops!==1)throw Error('Proxy này yêu cầu TRUST_PROXY_HOPS=1.');app.set('trust proxy',hops);
 app.use(helmet({contentSecurityPolicy:{directives:{defaultSrc:["'self'"],scriptSrc:["'self'"],styleSrc:["'self'","'unsafe-inline'","https://fonts.googleapis.com"],styleSrcElem:["'self'","https://fonts.googleapis.com"],fontSrc:["'self'","https://fonts.gstatic.com","data:"],imgSrc:["'self'","data:","blob:"],connectSrc:["'self'"],objectSrc:["'none'"],baseUri:["'self'"],frameAncestors:["'none'"],upgradeInsecureRequests:config.NODE_ENV==='production'?[]:null}}}));
 app.use(cors({origin(origin,cb){cb(null,!origin||origins.includes(origin));},methods:['GET','POST','OPTIONS'],allowedHeaders:['Content-Type','Authorization','X-Kien-Session','X-Kien-CSRF','X-Kien-User'],credentials:true}));
 app.use('/api',(req,res,next)=>{res.set('Cache-Control','no-store');if(req.get('origin')&&!origins.includes(req.get('origin')))return res.status(403).json({error:'Nguồn truy cập không được cho phép.'});next();});
 app.use('/api',(req,res,next)=>{if(req.method==='POST'&&!req.is('application/json'))return res.status(415).json({error:'Yêu cầu phải dùng application/json.'});next();});
 const limiter=(windowMs,limit,message,extra={})=>rateLimit({windowMs,limit,store:options.rateLimitStore?.(crypto.createHash('sha256').update(message).digest('hex').slice(0,16)),standardHeaders:'draft-8',legacyHeaders:false,message:{error:message},...extra});
 app.use('/api/progress',limiter(60e3,240,'Đồng bộ quá nhanh từ mạng này.'));
 app.use('/api',(req,res,next)=>{if(req.method==='POST'&&req.get('x-kien-session')==='cookie'&&!sameOrigin({get:k=>req.get(k)},origins))return res.status(403).json({error:'Nguồn thao tác không hợp lệ.'});next();});
 app.use(express.json({limit:'600kb',strict:true}));
 app.use('/api/auth',limiter(15*60e3,150,'Quá nhiều yêu cầu xác thực. Thử lại sau 15 phút.'));
 const sendLimit=limiter(60*60e3,15,'Đã đạt giới hạn gửi mã từ mạng này. Thử lại sau.');const loginLimit=limiter(15*60e3,30,'Quá nhiều lần xác thực. Thử lại sau 15 phút.');
 const emailOf=raw=>typeof raw==='string'&&raw.length<=254?raw.trim().toLowerCase():'';
 const emailValid=e=>/^[^\s@<>\"',;:()\\]+@[^\s@<>\"',;:()\\]+\.[^\s@<>\"',;:()\\]+$/.test(e);
 const otpHash=(email,code)=>crypto.createHmac('sha256',secret).update(email+'\0'+code).digest('hex');
 async function userJSON(u,connection=db){const profile=await connection.prepare('SELECT * FROM user_profiles WHERE user_id=?').get(u.id);return {id:u.id,email:u.email,hasPassword:!!u.password_hash,username:profile?.username||'',avatar:profile?.avatar||null,profileCompleted:!!profile?.completed,profileRevision:profile?.revision||0};}
 async function grant(user,remember,method,req,res,authAt=clock(),secondsOverride,connection=db){
  const id=crypto.randomUUID(),seconds=secondsOverride||(remember?7*86400:12*3600),now=clock();
  await connection.prepare('INSERT INTO sessions VALUES(?,?,?)').run(id,user.id,now+seconds*1000);
  const legacy=req.get('x-kien-session')!=='cookie'&&sessionAuth.legacyAllowed(config,now);
  const token=jwt.sign({sub:user.id,jti:id,method,authAt,remember:!!remember},secret,{algorithm:'HS256',issuer:'kienhoc',audience:legacy?'kienhoc-web':'kienhoc-cookie',expiresIn:seconds});
  if(!legacy)sessionAuth.setSession(res,token,remember,seconds,config);
  return {...(legacy?{token}:{session:'cookie',csrf:sessionAuth.csrf(id,secret)}),user:await userJSON(user,connection),expiresIn:seconds,remember:!!remember};
 }
 const authenticated=async(req,res,next)=>{try{
  const {payload,legacy}=sessionAuth.readSession({get:k=>req.get(k)},req.method,config,clock());
  const row=await db.prepare('SELECT * FROM sessions WHERE id=? AND user_id=? AND expires_at>?').get(payload.jti,payload.sub,clock());
  const user=await db.prepare('SELECT * FROM users WHERE id=?').get(payload.sub);if(!row||!user)throw Error();
  req.auth=payload;req.user=user;req.legacyAuth=legacy;req.sessionRow=row;next();
 }catch(error){if(error.status===409)return res.status(409).json({code:'ACCOUNT_CHANGED',error:'Tài khoản đã thay đổi ở tab khác. Hãy kiểm tra lại trước khi lưu.'});if(error.status===403)return res.status(403).json({code:'CSRF_REQUIRED',error:'Yêu cầu xác thực nguồn và mã CSRF hợp lệ.'});if(error.code&&!['ERR_JWT_EXPIRED','ERR_JWS_SIGNATURE_VERIFICATION_FAILED'].includes(error.code))return next(error);res.status(401).json({error:'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.'});}};
 const operations=require('./operations.cjs').createOperations({app,db,config,secret,clock,authenticated,limiter});
 app.use(operations.observeResponse);
 app.get('/api/health',async(req,res)=>{try{await db.prepare('SELECT id FROM users LIMIT 1').get();res.json({service:'kienhoc-api',ok:true,database:true,emailConfigured:!!(options.sendMail||(config.RESEND_API_KEY&&config.EMAIL_FROM))});}catch(error){console.error('Database health check failed:',error.code||error.name,require('./safe-db-error.cjs').safeDatabaseError(error,config.DATABASE_URL));res.status(503).json({service:'kienhoc-api',ok:false,database:false});}});
 app.post('/api/auth/send-otp',sendLimit,async(req,res,next)=>{const email=emailOf(req.body.email);if(!emailValid(email))return res.status(400).json({error:'Địa chỉ email không hợp lệ.'});if(!options.sendMail&&(!config.RESEND_API_KEY||!config.EMAIL_FROM))return res.status(503).json({error:'Máy chủ chưa cấu hình gửi email.'});
  const now=clock(),code=String(crypto.randomInt(0,1000000)).padStart(6,'0');
  const reserve=await db.transaction(async(db)=>{const latest=(await db.prepare('SELECT created_at FROM otps WHERE email=? ORDER BY id DESC LIMIT 1').get(email));if(latest){const elapsed=Math.max(0,now-latest.created_at);if(elapsed<30000)return {retryAfter:Math.ceil((30000-elapsed)/1000)};}const hour=(await db.prepare('SELECT COUNT(*) n FROM otps WHERE email=? AND created_at>?').get(email,now-3600000)).n;if(hour>=10)return {retryAfter:3600};(await db.prepare('UPDATE otps SET used=1 WHERE email=?').run(email));const row=(await db.prepare('INSERT INTO otps(email,code,expires_at,created_at) VALUES(?,?,?,?)').run(email,otpHash(email,code),now+300000,now));return {id:row.lastInsertRowid};},email);
  if(reserve.retryAfter){res.set('Retry-After',String(reserve.retryAfter));return res.status(429).json({error:'Vui lòng chờ trước khi gửi lại mã.',retryAfter:reserve.retryAfter});}
  try{await sendMail(email,code);(await db.prepare('DELETE FROM otps WHERE expires_at<?').run(now-86400000));(await db.prepare('DELETE FROM sessions WHERE expires_at<?').run(now));res.json({message:'Đã gửi mã đăng nhập. Mã có hiệu lực 5 phút.',retryAfter:30});}catch(e){(await db.prepare('UPDATE otps SET used=1 WHERE id=?').run(reserve.id));next(e);}
 });
 app.post('/api/auth/verify-otp',loginLimit,async(req,res)=>{const email=emailOf(req.body.email),code=req.body.code;if(!emailValid(email)||typeof code!=='string'||!/^\d{6}$/.test(code))return res.status(400).json({error:'Vui lòng nhập email và mã 6 số hợp lệ.'});const now=clock();const user=await db.transaction(async(db)=>{const row=(await db.prepare('SELECT * FROM otps WHERE email=? ORDER BY id DESC LIMIT 1').get(email));if(!row||row.used||row.expires_at<=now||row.attempts>=5)return null;(await db.prepare('UPDATE otps SET attempts=attempts+1 WHERE id=?').run(row.id));if(!crypto.timingSafeEqual(Buffer.from(row.code,'hex'),Buffer.from(otpHash(email,code),'hex')))return null;(await db.prepare('UPDATE otps SET used=1 WHERE id=?').run(row.id));(await db.prepare('INSERT OR IGNORE INTO users(id,email,created_at) VALUES(?,?,?)').run(crypto.randomUUID(),email,new Date(now).toISOString()));return (await db.prepare('SELECT * FROM users WHERE email=?').get(email));},email);if(!user)return res.status(401).json({error:'Mã không đúng, đã hết hạn hoặc đã dùng. Mỗi mã được thử tối đa 5 lần.'});res.json(await grant(user,req.body.remember!==false,'otp',req,res));});
 // Constant-cost failure for an unknown account as well as a wrong password.
 const dummyHash='$2b$12$Q65yAMRYY3fLQi7eXcVnl.wblP.oFzozo.hT1b9NCC92VVJJd1xyu';
 app.post('/api/auth/password-login',loginLimit,async(req,res)=>{const email=emailOf(req.body.email),password=req.body.password;if(!emailValid(email)||typeof password!=='string'||Buffer.byteLength(password)>72)return res.status(400).json({error:'Thông tin đăng nhập không hợp lệ.'});const user=(await db.prepare('SELECT * FROM users WHERE email=?').get(email));const correct=await bcrypt.compare(password,user?.password_hash||dummyHash);if(!correct||!user?.password_hash)return res.status(401).json({error:'Email hoặc mật khẩu chưa đúng. Bạn có thể đăng nhập bằng OTP.'});res.json(await grant(user,!!req.body.remember,'password',req,res));});
 app.get('/api/auth/me',authenticated,async(req,res)=>res.json({user:await userJSON(req.user),session:req.legacyAuth?'legacy':'cookie',csrf:req.legacyAuth?undefined:sessionAuth.csrf(req.auth.jti,secret),expiresIn:Math.max(0,Math.floor((req.sessionRow.expires_at-clock())/1000)),remember:!!req.auth.remember}));
 app.post('/api/auth/exchange',authenticated,async(req,res)=>{
  if(req.get('x-kien-session')!=='cookie'||!sameOrigin({get:k=>req.get(k)},origins))return res.status(403).json({error:'Nguồn chuyển phiên không hợp lệ.'});
  if(!req.legacyAuth)return res.status(409).json({error:'Phiên đã dùng cookie.'});
  const seconds=Math.min(7*86400,Math.floor((req.sessionRow.expires_at-clock())/1000),req.auth.exp-Math.floor(Date.now()/1000));
  if(seconds<=0)return res.status(401).end();
  const result=await db.transaction(async tx=>{
   const live=await tx.prepare('SELECT id FROM sessions WHERE id=? AND user_id=? AND expires_at>?').get(req.auth.jti,req.user.id,clock());if(!live)return null;
   const result=await grant(req.user,req.body.remember!==false,req.auth.method,req,res,req.auth.authAt,seconds,tx);
   await tx.prepare('DELETE FROM sessions WHERE id=?').run(req.auth.jti);return result;
  },req.user.email);
  if(!result)return res.status(401).json({error:'Phiên đã được chuyển hoặc thu hồi.'});res.json(result);
 });
 app.post('/api/auth/logout',authenticated,async(req,res)=>{(await db.prepare('DELETE FROM sessions WHERE id=?').run(req.auth.jti));sessionAuth.clearSession(res,config);res.json({ok:true});});
 app.post('/api/auth/set-password',authenticated,loginLimit,async(req,res)=>{if(req.auth.method!=='otp'||!Number.isSafeInteger(req.auth.authAt)||req.auth.authAt>clock()+30000||clock()-req.auth.authAt>15*60e3)return res.status(403).json({error:'Hãy đăng nhập lại bằng OTP trong vòng 15 phút trước khi đặt mật khẩu.'});const p=req.body.password;if(typeof p!=='string'||p.length<10||Buffer.byteLength(p)>72)return res.status(400).json({error:'Mật khẩu cần ít nhất 10 ký tự và tối đa 72 byte UTF-8.'});const hash=await bcrypt.hash(p,12);await db.transaction(async(db)=>{(await db.prepare('UPDATE users SET password_hash=? WHERE id=?').run(hash,req.user.id));(await db.prepare('DELETE FROM sessions WHERE user_id=? AND id<>?').run(req.user.id,req.auth.jti));await db.prepare('INSERT INTO security_mail(id,user_id,created_at,next_attempt,attempts,sent_at) VALUES(?,?,?,?,?,?)').run(crypto.randomUUID(),req.user.id,clock(),clock(),0,null);},req.user.email);res.json({ok:true,user:await userJSON({...req.user,password_hash:hash})});});
 app.post('/api/auth/profile',authenticated,limiter(60e3,20,'Bạn đang sửa hồ sơ quá nhanh. Hãy thử lại sau một phút.'),async(req,res)=>{
  let input;try{input=require('./profile.cjs').profileInput(req.body);}catch(error){return res.status(400).json({error:error.message});}
  const result=await db.transaction(async(connection)=>{
   const current=await userJSON(req.user,connection);
   if(input.expectedRevision!==current.profileRevision)return {conflict:current};
   const username=input.skip?current.username:input.username,avatar=input.skip?current.avatar:input.avatar;
   await connection.prepare('INSERT INTO user_profiles(user_id,username,avatar,completed,revision,updated_at) VALUES(?,?,?,?,?,?) ON CONFLICT(user_id) DO UPDATE SET username=excluded.username,avatar=excluded.avatar,completed=excluded.completed,revision=excluded.revision,updated_at=excluded.updated_at').run(req.user.id,username,avatar,1,current.profileRevision+1,new Date(clock()).toISOString());
   return {user:await userJSON(req.user,connection)};
  },req.user.email);
  if(result.conflict)return res.status(409).json({error:'Hồ sơ vừa được cập nhật trên thiết bị khác. Hãy kiểm tra bản mới trước khi lưu lại.',user:result.conflict});
  res.json(result);
 });
 app.use('/api/progress',authenticated);
 app.get('/api/progress',limiter(60e3,120,'Tải tiến độ quá nhanh.',{keyGenerator:req=>req.user.id}));
 app.post('/api/progress',limiter(60e3,90,'Đồng bộ quá nhanh. Dữ liệu vẫn được giữ trên thiết bị.',{keyGenerator:req=>req.user.id}));
 async function progressFor(id,dbConnection=db){const row=(await dbConnection.prepare('SELECT * FROM progress WHERE user_id=?').get(id));return row?{progressData:JSON.parse(row.data),revision:row.revision,updatedAt:row.updated_at}:{progressData:null,revision:0,updatedAt:null};}
 app.get('/api/progress',async(req,res)=>res.json(await progressFor(req.user.id)));
 app.post('/api/progress',async(req,res)=>{const {progressData,expectedRevision=0}=req.body;if(Object.keys(req.body).some(k=>!['progressData','expectedRevision'].includes(k))||!validProgress(progressData)||!Number.isInteger(expectedRevision)||expectedRevision<0)return res.status(400).json({error:'Dữ liệu tiến độ không hợp lệ.'});const result=await db.transaction(async(db)=>{const current=await progressFor(req.user.id,db);if(current.revision!==expectedRevision)return {conflict:current};const revision=current.revision+1,updatedAt=new Date(clock()).toISOString();(await db.prepare('INSERT INTO progress(user_id,data,updated_at,revision) VALUES(?,?,?,?) ON CONFLICT(user_id) DO UPDATE SET data=excluded.data,updated_at=excluded.updated_at,revision=excluded.revision').run(req.user.id,JSON.stringify(progressData),updatedAt,revision));return {revision,updatedAt};},req.user.email);if(result.conflict)return res.status(409).json({error:'Có cập nhật từ thiết bị khác.',...result.conflict});try{await operations.recordLearning(req.user.id,progressData,result.revision);}catch{console.error('Learning metrics unavailable');}res.json(result);});
 app.use('/api',(req,res)=>res.status(404).json({error:'API không tồn tại.'}));
 if(options.static!==false)app.use(express.static(path.join(__dirname,'../dist'),{dotfiles:'deny',index:'index.html',maxAge:0}));
 app.use((err,req,res,next)=>{const status=err.status||500;if(status>=500)console.error('Request failed:',req.method,req.path,status);res.status(status).json({error:status===413?'Dữ liệu quá lớn.':status===400?'Yêu cầu JSON không hợp lệ.':status<500?err.message:'Chưa xử lý được yêu cầu. Vui lòng thử lại.'});});
 return {app,db};
}
module.exports={createApp};
