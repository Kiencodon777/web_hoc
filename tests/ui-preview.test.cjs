const {test}=require('node:test'),assert=require('node:assert/strict');
const load=()=>import('../preview/worker.mjs');
const SHA='a'.repeat(40),origin='https://preview.example';
test('PR entry pins a single commit and never follows an arbitrary upstream',async()=>{
 const {handlePreview}=await load();const seen=[];
 const r=await handlePreview(new Request(origin+'/pr/12/'),{fetcher:async req=>{seen.push(req.url);return Response.json({base:{repo:{full_name:'Kiencodon777/web_hoc'}},head:{sha:SHA,repo:{full_name:'Kiencodon777/web_hoc'}}})}});
 assert.equal(r.status,302);assert.equal(r.headers.get('Location'),`/pr/12/revision/${SHA}/`);assert.equal(seen[0],'https://api.github.com/repos/Kiencodon777/web_hoc/pulls/12');
});
test('preview HTML pins relative assets, marks the commit, and blocks external APIs',async()=>{
 const {handlePreview}=await load();let upstream;
 const r=await handlePreview(new Request(origin+`/pr/1/revision/${SHA}/`),{fetcher:async url=>{upstream=url;return new Response('<html><head><base href="https://bad.example/"><script src="app.js"></script></head><body>UI</body></html>')}});
 const s=await r.text();assert.equal(upstream,`https://raw.githubusercontent.com/Kiencodon777/web_hoc/${SHA}/dist/index.html`);assert(s.includes(`base href="/pr/1/revision/${SHA}/"`));assert(!s.includes('https://bad.example/'));assert(s.includes('PR #1 · aaaaaaa'));assert(r.headers.get('Content-Security-Policy').includes("connect-src 'self'"));assert(r.headers.get('Content-Security-Policy').includes("worker-src 'none'"));assert(r.headers.get('X-Robots-Tag').includes('noindex'));
});
test('all API requests and unsafe asset paths are rejected without any network call',async()=>{
 const {handlePreview}=await load();let calls=0;const opts={fetcher:()=>{calls++;throw Error('Must not fetch')}};
 for(const path of ['/api/auth/send-otp',`/pr/1/revision/${SHA}/api/progress`])assert.equal((await handlePreview(new Request(origin+path,{method:'POST'}),opts)).status,503);
 for(const path of [`/pr/1/revision/${SHA}/%2eenv`,`/pr/1/revision/${SHA}/assets/%2e%2e%2f.env`])assert.equal((await handlePreview(new Request(origin+path),opts)).status,400);
 const r=await handlePreview(new Request(origin+`/pr/1/revision/${SHA}/api-config.js`),opts);assert.equal(await r.text(),"window.KIEN_CONFIG={apiBase:''};");assert.equal(calls,0);
});
test('unknown PR, rate limits and foreign forks fail clearly',async()=>{
 const {handlePreview}=await load();for(const [up,status]of [[404,404],[403,503],[429,503]])assert.equal((await handlePreview(new Request(origin+'/pr/9/'),{fetcher:async()=>new Response('',{status:up})})).status,status);
 const r=await handlePreview(new Request(origin+'/pr/9/'),{fetcher:async()=>Response.json({base:{repo:{full_name:'Kiencodon777/web_hoc'}},head:{sha:SHA,repo:{full_name:'someone/other'}}})});assert.equal(r.status,422);
});
