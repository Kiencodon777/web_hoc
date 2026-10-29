const crypto=require('node:crypto'),jwt=require('jsonwebtoken');
const COOKIE='__Host-kienhoc_ops',LOCAL_COOKIE='kienhoc_ops_local';
const scenes=new Set(['sakura','grid','gradient','chrome','topography','wave','still']);
const subjects=new Set(['history','information','ai','none']);
const views=new Set(['catalog','subject','home','bank','wrong','saved','guide','quiz','result','battle']);
const dayOf=t=>new Date(t+7*3600000).toISOString().slice(0,10);
const mask=email=>{const [name,domain]=String(email).split('@');return name.slice(0,2)+'•••@'+(domain||'');};
const num=x=>Number(x)||0;
const adminPathAllowed=path=>path==='/ops'||path.startsWith('/ops/')||path.startsWith('/api/ops/')||['/api/auth/send-otp','/api/auth/verify-otp'].includes(path);
function learningRows(data){return Object.entries(data?.subjects||{history:data}).filter(([id])=>subjects.has(id)&&id!=='none').map(([subject,s])=>{const p=Object.values(s?.progress||{});return {subject,answered:p.filter(v=>num(v.attempts)>0).length,attempts:p.reduce((n,v)=>n+num(v.attempts),0),correct:p.reduce((n,v)=>n+num(v.correct),0),bookmarks:Array.isArray(s?.bookmarks)?s.bookmarks.length:0};});}
function createOperations({app,db,config,secret,clock,authenticated,limiter}){
 const enabled=config.ADMIN_ENABLED==='true',telemetry=config.TELEMETRY_ENABLED==='true',production=config.NODE_ENV==='production';
 const emails=new Set(String(config.ADMIN_EMAILS||'').split(',').map(x=>x.trim().toLowerCase()).filter(Boolean));
 const cookieName=production?COOKIE:LOCAL_COOKIE;
 const cookieOptions={httpOnly:true,secure:production,sameSite:'strict',path:'/',maxAge:30*60e3};
 const hash=value=>crypto.createHmac('sha256',secret).update('ops\0'+value).digest('hex');
 const audit=(actor,action,target='')=>db.prepare('INSERT INTO ops_audit(id,at,actor,action,target) VALUES(?,?,?,?,?)').run(crypto.randomUUID(),clock(),actor,action,target);
 const originOK=req=>{try{return new URL(req.get('origin')).origin===new URL(config.ADMIN_ORIGIN).origin;}catch{return false;}};
 app.use((req,res,next)=>{let host;try{host=new URL(config.ADMIN_ORIGIN).host;}catch{}if(production&&host&&req.get('host')===host&&!adminPathAllowed(req.path)){if(req.path==='/'&&req.method==='GET')return res.redirect('/ops/login');return res.status(404).end();}next();});
 const closed=async(req,res,next)=>{
  if(!enabled||!emails.size)return res.status(404).end();
  if(production){let host;try{host=new URL(config.ADMIN_ORIGIN).host;}catch{return res.status(404).end();}if(req.get('host')!==host)return res.status(404).end();
   if(config.ADMIN_REQUIRE_ACCESS!=='false')try{req.accessEmail=await require('./operations-access.cjs').verifyAccess(req.get('cf-access-jwt-assertion'),config);if(!emails.has(req.accessEmail))throw Error();}catch(error){const known=['Access required','Invalid Access token','Access unavailable','Invalid Access keys','Access key unavailable','Access identity missing','jwt expired','invalid signature','jwt not active'];console.error('OPS_ACCESS_REJECTED',JSON.stringify({name:error?.name||'Error',reason:known.includes(error?.message)?error.message:'verification-error',code:typeof error?.code==='string'?error.code.slice(0,64):''}));return res.status(403).json({error:'Yêu cầu Cloudflare Access hợp lệ.'});}
  }next();
 };
 app.use(['/ops','/api/ops'],(req,res,next)=>{res.set({'Cache-Control':'no-store, private','X-Robots-Tag':'noindex, nofollow, noarchive','Referrer-Policy':'no-referrer'});closed(req,res,next);});
 const assets=require('./admin-assets.cjs');
 app.get('/ops/login',(req,res)=>res.type('html').send(assets.login));
 app.get('/ops/login.js',(req,res)=>res.type('js').send(assets.loginJS));
 app.get('/ops/login.css',(req,res)=>res.type('css').send(assets.css));
 app.post('/api/ops/session',limiter(15*60e3,15,'Quá nhiều yêu cầu quản trị.'),authenticated,async(req,res)=>{
  if(!originOK(req)||!emails.has(req.user.email.toLowerCase())||(req.accessEmail&&req.accessEmail!==req.user.email.toLowerCase())||req.auth.method!=='otp'||!Number.isSafeInteger(req.auth.authAt)||req.auth.authAt>clock()+30000||clock()-req.auth.authAt>5*60e3)return res.status(403).json({error:'Cần email được cấp quyền và OTP mới trong 5 phút.'});
  const id=crypto.randomUUID(),now=clock();await db.prepare('INSERT INTO ops_sessions(id,user_id,source_session,created_at,expires_at) VALUES(?,?,?,?,?)').run(id,req.user.id,req.auth.jti,now,now+30*60e3);
  await audit(req.user.id,'admin.login');
  const token=jwt.sign({sub:req.user.id,jti:id,source:req.auth.jti,csrf:crypto.randomBytes(24).toString('hex')},secret,{algorithm:'HS256',issuer:'kienhoc-operations',audience:'kienhoc-operations',expiresIn:1800});
  res.cookie(cookieName,token,cookieOptions).json({ok:true});
 });
 const authorize=async(req,res,next)=>{try{
  const cookies=String(req.get('cookie')||'').split(';').map(x=>x.trim()),raw=cookies.find(x=>x.startsWith(cookieName+'='))?.slice(cookieName.length+1);
  const auth=jwt.verify(raw,secret,{algorithms:['HS256'],issuer:'kienhoc-operations',audience:'kienhoc-operations'});
  const session=await db.prepare('SELECT * FROM ops_sessions WHERE id=? AND user_id=? AND expires_at>?').get(auth.jti,auth.sub,clock());
  const source=await db.prepare('SELECT id FROM sessions WHERE id=? AND user_id=? AND expires_at>?').get(auth.source,auth.sub,clock());
  const user=await db.prepare('SELECT id,email FROM users WHERE id=?').get(auth.sub);
  if(!session||session.source_session!==auth.source||!source||!user||!emails.has(user.email.toLowerCase())||(req.accessEmail&&req.accessEmail!==user.email.toLowerCase()))throw Error();
  req.ops={...auth,user};next();
 }catch(error){if(error.code&&error.code!=='ERR_INVALID_ARG_TYPE')return next(error);res.status(401).json({error:'Phiên quản trị không hợp lệ hoặc đã hết hạn.'});}};
 app.use('/ops',authorize);app.use('/api/ops',authorize,limiter(60e3,90,'Bạn tải thống kê quá nhanh.'));
 app.get('/ops',async(req,res)=>{await audit(req.ops.sub,'console.open');res.type('html').send(assets.index);});
 app.get('/ops/app.js',(req,res)=>res.type('js').send(assets.js));
 app.get('/ops/count-up.js',(req,res)=>res.type('js').send(assets.countup));
 app.get('/ops/style.css',(req,res)=>res.type('css').send(assets.css));
 app.post('/api/ops/logout',async(req,res)=>{if(!originOK(req)||req.get('x-ops-csrf')!==req.ops.csrf)return res.status(403).json({error:'Yêu cầu không hợp lệ.'});await db.prepare('DELETE FROM ops_sessions WHERE id=?').run(req.ops.jti);await audit(req.ops.sub,'admin.logout');res.clearCookie(cookieName,{...cookieOptions,maxAge:0}).json({ok:true});});
 app.get('/api/community/stats',limiter(60000,60,'Thử lại sau.'),async(req,res)=>{if(!telemetry)return res.status(404).end();const now=clock(),start=dayOf(now-89*86400000);const accounts=await db.prepare('SELECT COUNT(*) n FROM users').get(),visitors=await db.prepare('SELECT COUNT(DISTINCT visitor) n FROM ops_visits WHERE day>=?').get(start),online=await db.prepare('SELECT COUNT(DISTINCT visitor) n FROM ops_visits WHERE last_seen>?').get(now-120000);res.set('Cache-Control','public, max-age=15');res.json({accounts:num(accounts.n),visitors:num(visitors.n),online:num(online.n),windowDays:90,generatedAt:now,preview:false});});
 app.get('/api/ops/overview',async(req,res)=>{
  const days=[1,7,30,90].includes(Number(req.query.days))?Number(req.query.days):7,now=clock(),since=now-(days-1)*86400000,startDay=dayOf(since),start=Date.parse(startDay+'T00:00:00+07:00');
  const accounts=await db.prepare('SELECT COUNT(*) n FROM users').get(),newAccounts=await db.prepare('SELECT COUNT(*) n FROM users WHERE created_at>=?').get(new Date(start).toISOString());
  const visits=await db.prepare('SELECT day,COUNT(DISTINCT visitor) visitors,COUNT(DISTINCT user_id) members,SUM(views) views,SUM(active_ms) active_ms FROM ops_visits WHERE day>=? GROUP BY day ORDER BY day').all(startDay);
  const unique=await db.prepare('SELECT COUNT(DISTINCT visitor) n,COUNT(DISTINCT user_id) members FROM ops_visits WHERE day>=?').get(startDay);
  const online=await db.prepare('SELECT COUNT(DISTINCT visitor) n,COUNT(DISTINCT user_id) members FROM ops_visits WHERE last_seen>?').get(now-120000);
  const requests=await db.prepare('SELECT route,method,status,SUM(n) n,SUM(duration_ms) duration_ms,MAX(max_ms) max_ms FROM ops_requests WHERE minute>=? GROUP BY route,method,status ORDER BY n DESC').all(start);
  const events=await db.prepare('SELECT kind,label,COUNT(*) n,AVG(value) average,MAX(value) maximum FROM ops_events WHERE at>=? GROUP BY kind,label').all(start);
  const distribution=async field=>db.prepare(`SELECT ${field} label,COUNT(DISTINCT visitor) n FROM ops_visits WHERE day>=? GROUP BY ${field} ORDER BY n DESC`).all(startDay);
  const learning=await db.prepare('SELECT subject,COUNT(*) members,SUM(answered) answered,SUM(attempts) attempts,SUM(correct) correct,SUM(bookmarks) bookmarks FROM ops_learning GROUP BY subject').all();
  const coverage=await db.prepare('SELECT COUNT(DISTINCT user_id) n FROM ops_learning').get();
  const recent=await db.prepare('SELECT kind,label,at,subject FROM ops_events WHERE kind<>? ORDER BY at DESC LIMIT 15').all('metric');
  const first=await db.prepare('SELECT MIN(first_seen) at FROM ops_visits').get();
  const registered=await db.prepare('SELECT created_at FROM users WHERE created_at>=? ORDER BY created_at').all(new Date(start).toISOString());
  const timeline=Array.from({length:days},(_,i)=>{const day=dayOf(start+i*86400000),row=visits.find(x=>x.day===day)||{};return {day,visitors:num(row.visitors),members:num(row.members),views:num(row.views),registrations:registered.filter(x=>dayOf(Date.parse(x.created_at))===day).length};});
  const totalRequests=requests.reduce((n,x)=>n+num(x.n),0),failures=requests.filter(x=>x.status>=500).reduce((n,x)=>n+num(x.n),0);
  const latency=totalRequests?requests.reduce((n,x)=>n+num(x.duration_ms),0)/totalRequests:null;
  res.json({generatedAt:now,demo:config.ADMIN_DEMO==='true',days,csrf:req.ops.csrf,viewer:mask(req.ops.user.email),collectionSince:first?.at?num(first.at):null,totals:{accounts:num(accounts.n),newAccounts:num(newAccounts.n),visitors:num(unique.n),activeMembers:num(unique.members),online:num(online.n),onlineMembers:num(online.members),views:visits.reduce((n,x)=>n+num(x.views),0),activeMinutes:Math.round(visits.reduce((n,x)=>n+num(x.active_ms),0)/60000),requests:totalRequests,failures,errorRate:totalRequests?failures/totalRequests:null,latency,learningCoverage:num(coverage.n)},timeline,requests,events,learning,recent,devices:await distribution('device'),browsers:await distribution('browser'),scenes:await distribution('scene'),services:{database:'reachable',email:config.RESEND_API_KEY&&config.EMAIL_FROM?'configured':'not_configured',telemetry:telemetry?'enabled':'disabled'},limits:{onlineSeconds:120,retentionDays:90,externalUptime:false,cloudflareBilling:false,metricsAreClientReported:true}});
 });
 app.get('/api/ops/users',async(req,res)=>{
  const page=Math.max(1,Math.min(10000,Number.parseInt(req.query.page)||1)),search=String(req.query.search||'').slice(0,80).replace(/[\\%_]/g,'');
  const total=await db.prepare('SELECT COUNT(*) n FROM users WHERE email LIKE ?').get('%'+search+'%');
  const rows=await db.prepare('SELECT u.id,u.email,u.created_at,p.username,(SELECT SUM(answered) FROM ops_learning l WHERE l.user_id=u.id) answered,(SELECT MAX(last_seen) FROM ops_visits v WHERE v.user_id=u.id) last_seen FROM users u LEFT JOIN user_profiles p ON p.user_id=u.id WHERE u.email LIKE ? ORDER BY u.created_at DESC LIMIT 20 OFFSET ?').all('%'+search+'%',(page-1)*20);
  const users=rows.map(row=>({id:row.id,email:mask(row.email),username:row.username||'Chưa đặt tên',createdAt:row.created_at,lastSeen:row.last_seen?num(row.last_seen):null,online:num(row.last_seen)>clock()-120000,answered:num(row.answered)}));
  res.json({users,total:num(total.n),page,pageSize:20});
 });
 app.get('/api/ops/audit',async(req,res)=>{const rows=await db.prepare('SELECT a.at,a.action,a.target,u.email FROM ops_audit a LEFT JOIN users u ON u.id=a.actor ORDER BY a.at DESC LIMIT 100').all();res.json({entries:rows.map(({email,...row})=>({...row,actor:email?mask(email):'Tài khoản đã gỡ'}))});});
 app.get('/api/ops/export',async(req,res)=>{const rows=await db.prepare('SELECT day,COUNT(DISTINCT visitor) visitors,SUM(views) views FROM ops_visits GROUP BY day ORDER BY day DESC LIMIT 90').all();await audit(req.ops.sub,'report.export');res.set('Content-Disposition','attachment; filename="kienhoc-traffic.csv"').type('text/csv').send('\uFEFFday,visitors,views\n'+rows.map(x=>[x.day,num(x.visitors),num(x.views)].join(',')).join('\n'));});
 app.use('/ops',(req,res)=>res.status(404).end());
 const telemetryLimit=limiter(60e3,120,'Đã giới hạn bộ đếm.');
 app.post('/api/telemetry',telemetryLimit,async(req,res,next)=>{
  if(!telemetry)return res.status(404).end();
  const b=req.body,uuid=/^[a-f0-9-]{36}$/i;
  if(JSON.stringify(b).length>2048)return res.status(400).json({error:'Sự kiện quá lớn.'});
  if(!uuid.test(b.visitor)||!uuid.test(b.visit)||!['heartbeat','page_view','js_error','metric'].includes(b.kind)||!views.has(b.view)||!subjects.has(b.subject)||!scenes.has(b.scene))return res.status(400).json({error:'Sự kiện không hợp lệ.'});
  const ingest=async()=>{
   const now=clock(),day=dayOf(now),visitor=hash(b.visitor),visit=hash(b.visit),user=req.user?.id||null,device=['mobile','tablet','desktop'].includes(b.device)?b.device:'other',browser=['Chrome','Safari','Firefox','Edge'].includes(b.browser)?b.browser:'Other';
   await db.transaction(async tx=>{const previous=await tx.prepare('SELECT last_seen FROM ops_visits WHERE day=? AND visitor=? AND visit=?').get(day,visitor,visit);const active=previous?Math.max(0,Math.min(45000,now-num(previous.last_seen))):0;
    await tx.prepare('INSERT INTO ops_visits(day,visitor,visit,user_id,first_seen,last_seen,views,active_ms,device,browser,scene,view_name,subject) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?) ON CONFLICT(day,visitor,visit) DO UPDATE SET user_id=excluded.user_id,last_seen=excluded.last_seen,views=ops_visits.views+excluded.views,active_ms=ops_visits.active_ms+excluded.active_ms,scene=excluded.scene,view_name=excluded.view_name,subject=excluded.subject').run(day,visitor,visit,user,now,now,b.kind==='page_view'?1:0,active,device,browser,b.scene,b.view,b.subject);
    if(b.kind!=='heartbeat'){const errorTypes=['TypeError','ReferenceError','RangeError','SyntaxError','UnhandledRejection'];const label=b.kind==='js_error'?(errorTypes.includes(b.errorType)?b.errorType:'browser.runtime'):b.kind==='page_view'?b.view:['LCP','CLS','INP'].includes(b.label)?b.label:'other';const value=b.kind==='metric'?Math.min(60000,Math.max(0,num(b.value))):0;await tx.prepare('INSERT INTO ops_events(id,at,day,visitor,user_id,kind,label,value,subject,scene) VALUES(?,?,?,?,?,?,?,?,?,?)').run(crypto.randomUUID(),now,day,visitor,user,b.kind,label,value,b.subject,b.scene);}
   },'ops:'+visitor);res.status(204).end();
  };
  if(req.get('authorization'))return authenticated(req,res,()=>ingest().catch(next));await ingest();
 });
 async function observeResponse(req,res,next){if(!telemetry||!req.path.startsWith('/api/')||req.path.startsWith('/api/ops')||req.path==='/api/telemetry')return next();const start=clock(),json=res.json.bind(res);let done=false;
  res.json=function(body){if(done)return json(body);done=true;const duration=Math.max(0,clock()-start),minute=Math.floor(clock()/60000)*60000,route=['/api/auth/send-otp','/api/auth/verify-otp','/api/auth/password-login','/api/auth/me','/api/auth/logout','/api/auth/profile','/api/auth/set-password','/api/progress','/api/health'].includes(req.path)?req.path:'/api/other';
   db.prepare('INSERT INTO ops_requests(minute,route,method,status,n,duration_ms,max_ms) VALUES(?,?,?,?,?,?,?) ON CONFLICT(minute,route,method,status) DO UPDATE SET n=ops_requests.n+1,duration_ms=ops_requests.duration_ms+excluded.duration_ms,max_ms=CASE WHEN ops_requests.max_ms>excluded.max_ms THEN ops_requests.max_ms ELSE excluded.max_ms END').run(minute,route,req.method,res.statusCode,1,duration,duration).then(()=>json(body),()=>json(body));return res;
  };next();
 }
 async function recordLearning(user,data,revision){if(!telemetry)return;await db.transaction(async tx=>{for(const r of learningRows(data))await tx.prepare('INSERT INTO ops_learning(user_id,subject,answered,attempts,correct,bookmarks,updated_at,revision) VALUES(?,?,?,?,?,?,?,?) ON CONFLICT(user_id,subject) DO UPDATE SET answered=excluded.answered,attempts=excluded.attempts,correct=excluded.correct,bookmarks=excluded.bookmarks,updated_at=excluded.updated_at,revision=excluded.revision WHERE excluded.revision>=ops_learning.revision').run(user,r.subject,r.answered,r.attempts,r.correct,r.bookmarks,clock(),revision);},'ops-learning:'+user);}
 return {observeResponse,recordLearning};
}
async function pruneOperations(db,now){
 for(const [table,column,cutoff]of [['ops_visits','last_seen',now-90*86400000],['ops_events','at',now-90*86400000],['ops_requests','minute',now-90*86400000],['ops_audit','at',now-365*86400000],['ops_sessions','expires_at',now]])await db.prepare(`DELETE FROM ${table} WHERE ${column}<?`).run(cutoff);
}
module.exports={createOperations,learningRows,dayOf,pruneOperations,adminPathAllowed};
