const {test}=require('node:test'),assert=require('node:assert/strict');
const State=require('../dist/domain-state.js'),Progress=require('../dist/progress-merge.js');
const {handleDomainRouting,validTransfer,migrationPage}=require('../server/domain-routing.cjs');
const canonical='https://study.anhdungece.id.vn',source='https://kienhoc.anhdungcasi.workers.dev';
const config={CANONICAL_ORIGIN:canonical,CANONICAL_ENABLED:'true',MIGRATION_SOURCE_ORIGINS:source};
const empty=()=>({version:1,local:{},session:{}});
function storage(seed={},failsAt=Infinity){
 const values=new Map(Object.entries(seed));let writes=0;
 return {get length(){return values.size;},key:i=>[...values.keys()][i],getItem:k=>values.get(k)??null,
   setItem(k,v){if(++writes===failsAt)throw Error('quota');values.set(k,v);},removeItem:k=>values.delete(k),values};
}
function stateWithProgress(key,at){const state=empty(),data=Progress.blank();data.progress[key]={attempts:1,correct:1,last:true,lastAnswer:'B',at};state.local['su-ky-progress-v1']=JSON.stringify(data);return state;}
test('domain move merges both origins and preserves a timed session, bookmarks and appearance',()=>{
 const current=stateWithProgress('1.1',100),incoming=stateWithProgress('2.1',200);
 const root={version:2,history:Progress.blank(),ai:Progress.blank(),information:Progress.blank()};
 root.ai.session={subject:'ai',keys:['ai.1'],index:0,answers:{},mode:'exam',created:100,deadline:600100};root.ai._sync.sessionAt=200;
 incoming.local['kienhoc-progress-v2']=JSON.stringify(root);
 incoming.local['kienhoc-appearance-v1']=JSON.stringify({theme:'sakura'});
 const result=State.plan(current,incoming,300),merged=JSON.parse(result.local['su-ky-progress-v1']);
 assert(merged.progress['1.1']);assert(merged.progress['2.1']);
 assert.equal(JSON.parse(result.local['kienhoc-progress-v2']).ai.session.deadline,600100);
 assert.equal(JSON.parse(result.local['kienhoc-appearance-v1']).theme,'sakura');
 assert.equal(result.conflict,false);
 assert.deepEqual(State.plan({version:1,local:result.local,session:result.session},incoming,300).local['su-ky-progress-v1'],result.local['su-ky-progress-v1']);
});
test('domain move carries a valid tab session without extending expiry, not an expired identity',()=>{
 const incoming=empty();incoming.local['kienhoc-progress-owner']='account-a';
 incoming.local['su-ky-auth-token']='test-token';
 incoming.local['su-ky-auth-user']=JSON.stringify({id:'account-a',email:'a@example.invalid',remember:false,expiresAt:500});
 incoming.session['su-ky-auth-session']='account-a';
 const result=State.plan(empty(),incoming,100);
 assert.equal(result.local['su-ky-auth-token'],'test-token');
 assert.equal(result.session['su-ky-auth-session'],'account-a');
 assert.equal(JSON.parse(result.local['su-ky-auth-user']).expiresAt,500);
 assert.equal(State.plan(empty(),incoming,600).local['su-ky-auth-token'],undefined);
 assert(!result.local['kienhoc-domain-transfer-backup-v1'].includes('test-token'));
});
test('domain move never overwrites or merges a different active account',()=>{
 const current=stateWithProgress('1.1',100),incoming=stateWithProgress('2.1',200);
 current.local['kienhoc-progress-owner']='account-b';incoming.local['kienhoc-progress-owner']='account-a';
 current.local['su-ky-auth-token']='current-token';incoming.local['su-ky-auth-token']='incoming-token';
 const result=State.plan(current,incoming,300);
 assert(result.conflict);assert.equal(result.local['su-ky-auth-token'],'current-token');
 assert.equal(result.local['su-ky-progress-v1'],current.local['su-ky-progress-v1']);
 assert(JSON.parse(result.local['kienhoc-account-cache:account-a']).progress['2.1']);
});
test('domain move capture is scoped and failed writes roll back destination storage',()=>{
 const local=storage({'su-ky-progress-v1':'{}',unrelated:'private-other-app'}),session=storage();
 const captured=State.capture(local,session);
 assert.equal(captured.local.unrelated,undefined);assert.equal(local.getItem('su-ky-progress-v1'),'{}');
 const destination=storage({existing:'safe'},2);
 assert.throws(()=>State.apply(destination,session,{local:{first:'1',second:'2'},session:{}}),/quota/);
 assert.deepEqual([...destination.values],[['existing','safe']]);
});
test('domain router keeps canonical host, gates activation and returns a no-store receive page',async()=>{
 assert.equal(await handleDomainRouting(new Request(canonical+'/'),config),null);
 assert.equal(await handleDomainRouting(new Request(source+'/'),{...config,CANONICAL_ENABLED:'false'}),null);
 const moved=await handleDomainRouting(new Request(source+'/'),config);assert.equal(moved.status,200);assert((await moved.text()).includes('"mode":"export"'));
 const response=await handleDomainRouting(new Request(canonical+'/domain-transfer/receive'),config),html=await response.text();
 assert.equal(response.status,200);assert.equal(response.headers.get('Cache-Control'),'no-store');
 assert(html.includes('"mode":"receive"'));
 assert.equal((await handleDomainRouting(new Request(source+'/domain-transfer/receive'),config)).status,403);
 assert.equal((await handleDomainRouting(new Request(canonical+'/domain-transfer/receive',{method:'POST'}),config)).status,405);
 const escaped=await migrationPage({canonicalOrigin:canonical,label:'</script><img src=x>'}).text();
 assert(!escaped.includes('</script><img src=x>'));assert(escaped.includes('\\u003c'));
});
test('domain router rejects unrelated storage, malformed JSON and nested prototype pollution',()=>{
 const invalid=empty();invalid.local.passwordManager='secret';assert(!validTransfer(invalid));
 const polluted=empty();polluted.local['su-ky-progress-v1']='{"__proto__":{"polluted":true}}';assert(!validTransfer(polluted));
 const malformed=empty();malformed.local['kienhoc-layout-v1']='not json';assert(!validTransfer(malformed));
 assert(validTransfer(empty()));
});

test('old public domain and www transfer browser progress to the canonical study host',async()=>{
 const live=JSON.parse(require('node:fs').readFileSync(require('node:path').join(__dirname,'../wrangler.jsonc'),'utf8'));
 for(const origin of ['https://vietkienetet.id.vn','https://www.vietkienetet.id.vn']){
  const r=await handleDomainRouting(new Request(origin+'/'),live.vars);assert.equal(r.status,200);assert.equal(r.headers.get('Cache-Control'),'no-store');const html=await r.text();assert(html.includes('"mode":"export"'));assert(html.includes(canonical));
 }
 assert.equal(await handleDomainRouting(new Request(canonical+'/'),live.vars),null);
});

