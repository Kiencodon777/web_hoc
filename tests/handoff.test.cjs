const {test}=require('node:test'),assert=require('node:assert/strict');
const {handleHandoff,digest,open}=require('../server/domain-handoff.cjs');
const source='https://kienhoc.anhdungcasi.workers.dev',canonical='https://study.anhdungece.id.vn';
const config={CANONICAL_ENABLED:'true',CANONICAL_ORIGIN:canonical,MIGRATION_SOURCE_ORIGINS:source,AUTH_LEGACY_UNTIL:new Date(Date.now()+6*86400000).toISOString(),JWT_SECRET:'test-only-'+ 's'.repeat(48)};
function fixture(){const rows=new Map();return{rows,
 consumeRate:async()=>({totalHits:1}),
 saveHandoff:async(hash,payload,expires)=>rows.set(hash,{payload,expires}),
 takeHandoff:async(hash,now)=>{const row=rows.get(hash);if(!row||row.expires<=now)return null;rows.delete(hash);return row.payload;}
};}
const request=(host,path,body,origin=host)=>new Request(host+'/api/domain-transfer/'+path,{method:'POST',headers:{Origin:origin,'Content-Type':'application/json'},body:JSON.stringify(body)});
const state=()=>({version:1,local:{'su-ky-auth-token':'private-test-token','su-ky-auth-user':JSON.stringify({id:'account-a',email:'private@example.invalid'})},session:{}});
test('handoff encrypts browser data at rest, hashes the opaque code and consumes it once',async()=>{
 const store=fixture(),created=await handleHandoff(request(source,'create',{state:state(),returnTo:'/?course=ai#question'}),config,store,'test-ip',100);
 assert.equal(created.status,200);const {token}=await created.json();assert.match(token,/^[A-Za-z0-9_-]{43}$/);
 const row=store.rows.get(digest(token));assert(row);assert(!row.payload.includes('private-test-token'));assert(!row.payload.includes('private@example.invalid'));
 assert.deepEqual(open(row.payload,config.JWT_SECRET).state,state());
 const received=await handleHandoff(request(canonical,'consume',{token}),config,store,'test-ip',200);
 assert.equal(received.status,200);assert.equal(received.headers.get('Cache-Control'),'no-store');
 const publicState=(await received.json()).state;assert.equal(publicState.local['su-ky-auth-token'],undefined);assert.equal(publicState.local['su-ky-auth-user'],undefined);
 assert.equal((await handleHandoff(request(canonical,'consume',{token}),config,store,'test-ip',201)).status,410);
});
test('handoff expires, validates origins and blocks open redirects and storage injection',async()=>{
 const store=fixture();
 assert.equal((await handleHandoff(request(source,'create',{state:state()},'https://attacker.invalid'),config,store,'ip',100)).status,403);
 assert.equal((await handleHandoff(request(canonical,'create',{state:state()}),config,store,'ip',100)).status,403);
 assert.equal((await handleHandoff(request(source,'create',{state:state(),returnTo:'//attacker.invalid'}),config,store,'ip',100)).status,400);
 const bad=state();bad.local.unrelated='data';assert.equal((await handleHandoff(request(source,'create',{state:bad}),config,store,'ip',100)).status,400);
 const created=await handleHandoff(request(source,'create',{state:state()}),config,store,'ip',100),{token}=await created.json();
 assert.equal((await handleHandoff(request(canonical,'consume',{token}),config,store,'ip',120100)).status,410);
 assert.equal((await handleHandoff(request(source,'consume',{token}),config,store,'ip',200)).status,403);
});
