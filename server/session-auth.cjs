const jwt=require('jsonwebtoken'),crypto=require('node:crypto');
const {parseOrigins,sameOrigin}=require('./origins.cjs');
const name=config=>config.NODE_ENV==='production'?'__Host-kienhoc_session':'kienhoc_session_local';
const legacyAllowed=(config,now=Date.now())=>Number.isFinite(Date.parse(config.AUTH_LEGACY_UNTIL))&&now<Date.parse(config.AUTH_LEGACY_UNTIL);
const cookieToken=(headers,config)=>String(headers.get('cookie')||'').split(';').map(x=>x.trim()).find(x=>x.startsWith(name(config)+'='))?.slice(name(config).length+1);
const csrf=(id,secret)=>crypto.createHmac('sha256',secret).update('web-csrf\0'+id).digest('hex');
function readSession(headers,method,config,now=Date.now()){
 const bearer=headers.get('authorization')||'',legacy=bearer.startsWith('Bearer '),token=legacy?bearer.slice(7):cookieToken(headers,config);
 if(!token||legacy&&!legacyAllowed(config,now))throw Error('Session required');
 const payload=jwt.verify(token,config.JWT_SECRET,{algorithms:['HS256'],issuer:'kienhoc',audience:legacy?'kienhoc-web':'kienhoc-cookie'});
 if(!legacy&&!['GET','HEAD','OPTIONS'].includes(method)){
  if(headers.get('x-kien-user')&&headers.get('x-kien-user')!==payload.sub)throw Object.assign(Error('Account changed'),{status:409});
  if(!sameOrigin(headers,parseOrigins(config.APP_ORIGINS))||headers.get('x-kien-csrf')!==csrf(payload.jti,config.JWT_SECRET))throw Object.assign(Error('CSRF required'),{status:403});
 }
 return {payload,legacy};
}
function setSession(res,token,remember,seconds,config){res.cookie(name(config),token,{httpOnly:true,secure:config.NODE_ENV==='production',sameSite:'strict',path:'/',...(remember?{maxAge:seconds*1000}:{})});}
function clearSession(res,config){res.clearCookie(name(config),{httpOnly:true,secure:config.NODE_ENV==='production',sameSite:'strict',path:'/'});}
function cookieHeader(token,remember,seconds,config){return name(config)+'='+token+'; Path=/; HttpOnly; SameSite=Strict'+(config.NODE_ENV==='production'?'; Secure':'')+(remember?'; Max-Age='+seconds:'');}
module.exports={cookieHeader,readSession,cookieToken,csrf,setSession,clearSession,legacyAllowed};
