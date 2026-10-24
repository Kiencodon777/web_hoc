const crypto=require('node:crypto');
const {validTransfer}=require('./domain-routing.cjs');
const digest=token=>crypto.createHash('sha256').update(token).digest('hex');
const keyFor=secret=>crypto.createHmac('sha256',secret).update('kienhoc-domain-handoff-v1').digest();
function seal(value,secret){
 const iv=crypto.randomBytes(12),cipher=crypto.createCipheriv('aes-256-gcm',keyFor(secret),iv);
 const encrypted=Buffer.concat([cipher.update(JSON.stringify(value),'utf8'),cipher.final()]);
 return Buffer.concat([iv,cipher.getAuthTag(),encrypted]).toString('base64');
}
function open(encrypted,secret){
 const data=Buffer.from(encrypted,'base64'),cipher=crypto.createDecipheriv('aes-256-gcm',keyFor(secret),data.subarray(0,12));
 cipher.setAuthTag(data.subarray(12,28));
 return JSON.parse(Buffer.concat([cipher.update(data.subarray(28)),cipher.final()]).toString('utf8'));
}
const reply=(body,status=200)=>Response.json(body,{status,headers:{'Cache-Control':'no-store','Referrer-Policy':'no-referrer','X-Content-Type-Options':'nosniff'}});
async function readJSON(request){
 const reader=request.body?.getReader();if(!reader)throw Error('Empty body');
 let total=0;const chunks=[];
 while(true){const {done,value}=await reader.read();if(done)break;total+=value.byteLength;
   if(total>2_100_000){await reader.cancel();throw Object.assign(Error('Too large'),{status:413});}chunks.push(value);}
 try{return JSON.parse(Buffer.concat(chunks).toString('utf8'));}
 catch{throw Object.assign(Error('Invalid JSON'),{status:400});}
}
async function handleHandoff(request,config,store,ip,now=Date.now()){
 const url=new URL(request.url),canonical=config.CANONICAL_ORIGIN;
 if(config.CANONICAL_ENABLED!=='true')return reply({error:'Chưa bật chuyển địa chỉ.'},404);
 const sources=(config.MIGRATION_SOURCE_ORIGINS||'').split(',').map(s=>s.trim());
 if(request.method!=='POST')return reply({error:'Yêu cầu POST.'},405);
 const creating=url.pathname==='/api/domain-transfer/create';
 if(!creating&&url.pathname!=='/api/domain-transfer/consume')return reply({error:'Không tồn tại.'},404);
 if(request.headers.get('Origin')!==url.origin || (creating?!sources.includes(url.origin):url.origin!==canonical))
   return reply({error:'Nguồn chuyển phiên không hợp lệ.'},403);
 if(!request.headers.get('Content-Type')?.startsWith('application/json'))return reply({error:'Yêu cầu JSON.'},415);
 try{
   const limit=await store.consumeRate('domain-move:'+url.pathname+':'+ip,3600000);
   if(limit.totalHits>30)return reply({error:'Đã đạt giới hạn chuyển phiên. Tiến độ cũ vẫn được giữ.'},429);
   const body=await readJSON(request);
   if(creating){
     if(!validTransfer(body.state))return reply({error:'Dữ liệu chuyển phiên không hợp lệ.'},400);
     const returnTo=body.returnTo||'/';
     if(typeof returnTo!=='string')return reply({error:'Đường dẫn không hợp lệ.'},400);
     let next;try{next=new URL(returnTo,canonical);}catch{return reply({error:'Đường dẫn không hợp lệ.'},400);}
     if(!returnTo.startsWith('/')||returnTo.startsWith('//')||next.origin!==canonical||next.pathname.startsWith('/domain-transfer/'))
       return reply({error:'Đường dẫn tiếp tục không hợp lệ.'},400);
     const token=crypto.randomBytes(32).toString('base64url');
     const encrypted=seal({state:body.state,returnTo:next.pathname+next.search+next.hash,sourceOrigin:url.origin,targetOrigin:canonical},config.JWT_SECRET);
     await store.saveHandoff(digest(token),encrypted,now+120000,now);
     return reply({token});
   }
   if(typeof body.token!=='string'||!/^[A-Za-z0-9_-]{43}$/.test(body.token))return reply({error:'Mã chuyển phiên không hợp lệ.'},400);
   const encrypted=await store.takeHandoff(digest(body.token),now);
   if(!encrypted)return reply({error:'Mã chuyển phiên đã hết hạn hoặc đã dùng. Hãy mở lại địa chỉ cũ để thử lại.'},410);
   const value=open(encrypted,config.JWT_SECRET);
   if(value.targetOrigin!==canonical||!sources.includes(value.sourceOrigin)||!validTransfer(value.state))throw Error('Invalid transfer');
   return reply(value);
 }catch(error){return reply({error:'Chưa chuyển được phiên học. Dữ liệu ở địa chỉ cũ vẫn được giữ.'},error.status||500);}
}
module.exports={handleHandoff,seal,open,digest};
