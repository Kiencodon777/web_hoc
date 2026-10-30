const crypto=require('node:crypto'),jwt=require('jsonwebtoken');
const cache=new Map();
async function verifyAccess(token,config,fetcher=fetch){
 const team=config.ADMIN_ACCESS_TEAM,aud=config.ADMIN_ACCESS_AUD;
 if(!/^[a-z0-9-]{1,63}$/.test(team||'')||!aud||typeof token!=='string'||token.length>12000)throw Error('Access required');
 const header=jwt.decode(token,{complete:true})?.header;if(header?.alg!=='RS256'||typeof header.kid!=='string')throw Error('Invalid Access token');
 let entry=cache.get(team);if(!entry||entry.until<Date.now()){
  // Workers supports follow/manual; manual plus !ok rejects redirects without following them.
  const r=await fetcher(`https://${team}.cloudflareaccess.com/cdn-cgi/access/certs`,{redirect:'manual',signal:AbortSignal.timeout(5000)});if(!r.ok)throw Error('Access unavailable');const result=await r.json();
  if(!Array.isArray(result.keys))throw Error('Invalid Access keys');entry={keys:result.keys.slice(0,20),until:Date.now()+5*60000};cache.set(team,entry);
 }
 const jwk=entry.keys.find(x=>x.kid===header.kid&&x.kty==='RSA');if(!jwk)throw Error('Access key unavailable');
 const claims=jwt.verify(token,crypto.createPublicKey({key:jwk,format:'jwk'}),{algorithms:['RS256'],issuer:`https://${team}.cloudflareaccess.com`,audience:aud});
 if(typeof claims.email!=='string')throw Error('Access identity missing');return claims.email.toLowerCase();
}
module.exports={verifyAccess};
