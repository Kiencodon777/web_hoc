const {test}=require('node:test'),assert=require('node:assert/strict'),request=require('supertest'),crypto=require('node:crypto'),fs=require('node:fs');
const {createApp}=require('../server/app.cjs'),{openDatabase}=require('../server/database.cjs'),{dayOf,learningRows,pruneOperations}=require('../server/operations.cjs');
function fixture(options={}){const raw=openDatabase(':memory:'),emails=[],config={JWT_SECRET:'test-only-operations-'+ 's'.repeat(48),NODE_ENV:'test',ADMIN_ENABLED:'true',TELEMETRY_ENABLED:'true',ADMIN_ORIGIN:'http://localhost:3197',APP_ORIGINS:'http://localhost:3197',ADMIN_EMAILS:'owner@example.test',...options};const {app,db}=createApp({db:raw,config,sendMail:async(email,code)=>emails.push({email,code})});return{raw,app,db,emails,config};}
async function login(h,email='owner@example.test'){await request(h.app).post('/api/auth/send-otp').send({email}).expect(200);const r=await request(h.app).post('/api/auth/verify-otp').send({email,code:h.emails.at(-1).code,remember:false}).expect(200);return r.body;}
async function admin(h){const auth=await login(h),r=await request(h.app).post('/api/ops/session').set('Origin',h.config.ADMIN_ORIGIN).auth(auth.token,{type:'bearer'}).send({}).expect(200);return{auth,cookie:r.headers['set-cookie'][0].split(';')[0]};}
const payload=(overrides={})=>({visitor:'11111111-1111-4111-8111-111111111111',visit:'22222222-2222-4222-8222-222222222222',kind:'page_view',view:'catalog',subject:'none',scene:'wave',device:'mobile',browser:'Safari',...overrides});
test('admin is closed by default and private HTML/scripts never arrive through public static paths',async()=>{
 const h=fixture({ADMIN_ENABLED:'false'});for(const path of ['/ops','/ops/app.js','/ops/style.css','/ops/login','/api/ops/overview'])await request(h.app).get(path).expect(404);
 await request(h.app).get('/admin/app.js').expect(404);await request(h.app).get('/server/admin-assets.cjs').expect(404);h.raw.close();
});
test('allowlist, fresh OTP, separate HttpOnly cookie, origin and server-session revocation protect every admin surface',async()=>{
 const h=fixture();for(const path of ['/ops','/ops/app.js','/api/ops/overview','/api/ops/users','/api/ops/export'])await request(h.app).get(path).expect(401);
 const outsider=await login(h,'learner@example.test');await request(h.app).post('/api/ops/session').set('Origin',h.config.ADMIN_ORIGIN).auth(outsider.token,{type:'bearer'}).send({email:'owner@example.test'}).expect(403);
 const {auth,cookie}=await admin(h);await request(h.app).get('/api/ops/overview').auth(auth.token,{type:'bearer'}).expect(401);
 const overview=await request(h.app).get('/api/ops/overview').set('Cookie',cookie).expect(200);assert.equal(overview.body.totals.accounts,2);assert.equal(overview.headers['cache-control'],'no-store, private');
 await request(h.app).get('/ops/app.js').set('Cookie',cookie).expect(200);await request(h.app).post('/api/ops/logout').set('Cookie',cookie).send({}).expect(403);
 await request(h.app).post('/api/auth/logout').auth(auth.token,{type:'bearer'}).send({}).expect(200);await request(h.app).get('/api/ops/overview').set('Cookie',cookie).expect(401);h.raw.close();
});
test('telemetry deduplicates visitors, rejects spoofed account IDs, avoids raw secrets and has a defined online window',async()=>{
 const h=fixture();const {cookie,auth}=await admin(h);await request(h.app).post('/api/telemetry').send(payload({user_id:auth.user.id,error:'password=should-not-store'})).expect(204);
 await request(h.app).post('/api/telemetry').auth(auth.token,{type:'bearer'}).send(payload({visit:crypto.randomUUID(),kind:'heartbeat'})).expect(204);
 await request(h.app).post('/api/telemetry').send(payload({kind:'js_error',label:'<script>secret</script>'})).expect(204);await request(h.app).post('/api/telemetry').send(payload({view:'https://secret.example/?token=a'})).expect(400);
 let r=await request(h.app).get('/api/ops/overview').set('Cookie',cookie).expect(200);assert.equal(r.body.totals.visitors,1);assert.equal(r.body.totals.online,1);assert.equal(r.body.totals.onlineMembers,1);assert.equal(h.raw.prepare('SELECT user_id FROM ops_visits WHERE visit=?').get('not-an-id'),undefined);
 assert(!JSON.stringify(h.raw.prepare('SELECT * FROM ops_events').all()).includes('should-not-store'));assert.equal(h.raw.prepare('SELECT label FROM ops_events WHERE kind=?').get('js_error').label,'browser.runtime');
 h.raw.prepare('UPDATE ops_visits SET last_seen=?').run(Date.now()-121000);r=await request(h.app).get('/api/ops/overview').set('Cookie',cookie).expect(200);assert.equal(r.body.totals.online,0);
 const u=await request(h.app).get('/api/ops/users').set('Cookie',cookie).expect(200);assert(!JSON.stringify(u.body).includes('owner@example.test'));h.raw.close();
});
test('admin cookie expires independently; logout requires CSRF and revokes only admin access',async()=>{
 const h=fixture(),{cookie,auth}=await admin(h);const r=await request(h.app).get('/api/ops/overview').set('Cookie',cookie);await request(h.app).post('/api/ops/logout').set('Cookie',cookie).set('Origin',h.config.ADMIN_ORIGIN).set('X-Ops-CSRF',r.body.csrf).send({}).expect(200);await request(h.app).get('/ops').set('Cookie',cookie).expect(401);await request(h.app).get('/api/auth/me').auth(auth.token,{type:'bearer'}).expect(200);h.raw.close();
});
test('a stale OTP cannot mint admin access and production cookies enforce browser restrictions',async()=>{
 const h=fixture({NODE_ENV:'production',ADMIN_REQUIRE_ACCESS:'false',ADMIN_ORIGIN:'https://admin.example.test',APP_ORIGINS:'https://admin.example.test'}),auth=await login(h),jwt=require('jsonwebtoken'),claims=jwt.decode(auth.token);
 const stale=jwt.sign({sub:claims.sub,jti:claims.jti,method:'otp',authAt:Date.now()-6*60000},h.config.JWT_SECRET,{issuer:'kienhoc',audience:'kienhoc-web',expiresIn:3600});
 await request(h.app).post('/api/ops/session').set('Host','admin.example.test').set('Origin',h.config.ADMIN_ORIGIN).auth(stale,{type:'bearer'}).send({}).expect(403);
 const r=await request(h.app).post('/api/ops/session').set('Host','admin.example.test').set('Origin',h.config.ADMIN_ORIGIN).auth(auth.token,{type:'bearer'}).send({}).expect(200),cookie=r.headers['set-cookie'][0];
 for(const expected of ['__Host-kienhoc_ops=','HttpOnly','Secure','SameSite=Strict','Path=/'])assert(cookie.includes(expected));
 h.raw.prepare('UPDATE ops_sessions SET expires_at=?').run(Date.now()-1000);await request(h.app).get('/ops').set('Host','admin.example.test').set('Cookie',cookie.split(';')[0]).expect(401);h.raw.close();
});
test('operations SQL runs on PostgreSQL with private RLS tables and real aggregates',async()=>{
 const {PGlite}=require('@electric-sql/pglite'),{postgresStorage}=require('../server/postgres.cjs'),path=require('node:path');const engine=new PGlite();
 for(const file of fs.readdirSync(path.join(__dirname,'../supabase/migrations')).filter(x=>x.endsWith('.sql')).sort())await engine.exec(fs.readFileSync(path.join(__dirname,'../supabase/migrations',file),'utf8'));
 const query=async(sql,args)=>{const r=await engine.query(sql,args);return {...r,rowCount:r.affectedRows}},db=postgresStorage({query,connect:async()=>({query,release(){}}),end:()=>engine.close()}),emails=[];
 const config={JWT_SECRET:'operations-pg-test-'+ 'p'.repeat(48),ADMIN_ENABLED:'true',TELEMETRY_ENABLED:'true',ADMIN_ORIGIN:'http://localhost:3197',APP_ORIGINS:'http://localhost:3197',ADMIN_EMAILS:'owner@example.test'};
 const {app}=createApp({db,config,sendMail:async(email,code)=>emails.push({email,code})}),h={app,config,emails};const {cookie}=await admin(h);
 await request(app).post('/api/telemetry').send(payload()).expect(204);const r=await request(app).get('/api/ops/overview').set('Cookie',cookie).expect(200);assert.equal(r.body.totals.visitors,1);assert(r.body.totals.requests>=2);
 await request(app).post('/api/progress').auth((await login(h,'learner@example.test')).token,{type:'bearer'}).send({progressData:require('../dist/progress-merge.js').blank(),expectedRevision:0}).expect(200);
 await request(app).get('/api/ops/users').set('Cookie',cookie).expect(200);await request(app).get('/api/ops/export').set('Cookie',cookie).expect(200);
 const tables=await engine.query("SELECT relname,relrowsecurity FROM pg_class JOIN pg_namespace ON pg_namespace.oid=relnamespace WHERE nspname='kienhoc' AND relname LIKE 'ops_%' AND relkind='r'");assert.equal(tables.rows.length,6);assert(tables.rows.every(x=>x.relrowsecurity));await db.close();
});
test('production requires a configured host and signed Cloudflare Access identity by default',async()=>{
 const h=fixture({NODE_ENV:'production',ADMIN_ORIGIN:'https://admin.example.test'});
 await request(h.app).get('/ops/login').expect(404);
 await request(h.app).get('/ops/login').set('Host','admin.example.test').expect(403);
 await request(h.app).get('/ops/login').set('Host','admin.example.test').set('Cf-Access-Jwt-Assertion','forged').expect(403);h.raw.close();
});
test('Access verifier pins algorithm, issuer, audience, signature and email',async()=>{
 const {verifyAccess}=require('../server/operations-access.cjs'),jwt=require('jsonwebtoken'),{privateKey,publicKey}=crypto.generateKeyPairSync('rsa',{modulusLength:2048}),jwk=publicKey.export({format:'jwk'});jwk.kid='test-kid';
 const config={ADMIN_ACCESS_TEAM:'ops-test',ADMIN_ACCESS_AUD:'test-audience'},fetcher=async(url,options)=>{assert.equal(options.redirect,'manual');return {ok:true,json:async()=>({keys:[jwk]})};};
 const sign=(audience='test-audience')=>jwt.sign({email:'Owner@Example.test'},privateKey,{algorithm:'RS256',keyid:jwk.kid,issuer:'https://ops-test.cloudflareaccess.com',audience,expiresIn:120});
 assert.equal(await verifyAccess(sign(),config,fetcher),'owner@example.test');await assert.rejects(()=>verifyAccess(sign('wrong-audience'),config,fetcher));await assert.rejects(()=>verifyAccess(jwt.sign({email:'owner@example.test'},'fake-secret'),config,fetcher));
});
test('Access key fetch rejects redirects and unavailable responses without reading their body',async()=>{
 const {verifyAccess}=require('../server/operations-access.cjs'),jwt=require('jsonwebtoken'),{privateKey}=crypto.generateKeyPairSync('rsa',{modulusLength:2048});
 const token=jwt.sign({email:'owner@example.test'},privateKey,{algorithm:'RS256',keyid:'redirect-key',issuer:'https://redirect-test.cloudflareaccess.com',audience:'redirect-audience',expiresIn:120});
 for(const status of [302,503]){let calls=0;await assert.rejects(()=>verifyAccess(token,{ADMIN_ACCESS_TEAM:'redirect-test',ADMIN_ACCESS_AUD:'redirect-audience'},async(url,options)=>{calls++;assert.equal(options.redirect,'manual');return {ok:false,status,json:async()=>{throw Error('Untrusted body must not be read')}};}),/Access unavailable/);assert.equal(calls,1);}
});
test('learning summaries preserve source progress and retention removes only old operations records',async()=>{
 const data={subjects:{ai:{progress:{'ai.1':{attempts:3,correct:2}},bookmarks:['ai.1']}}},copy=JSON.stringify(data);assert.deepEqual(learningRows(data),[{subject:'ai',answered:1,attempts:3,correct:2,bookmarks:1}]);assert.equal(JSON.stringify(data),copy);assert.equal(dayOf(Date.parse('2026-10-28T18:00:00Z')),'2026-10-29');
 const h=fixture(),{cookie}=await admin(h);await request(h.app).post('/api/telemetry').send(payload()).expect(204);h.raw.prepare('UPDATE ops_visits SET last_seen=?').run(0);await pruneOperations(h.db,Date.now());assert.equal(h.raw.prepare('SELECT COUNT(*) n FROM ops_visits').get().n,0);assert.equal(h.raw.prepare('SELECT COUNT(*) n FROM users').get().n,1);h.raw.close();
});
test('successful progress saves refresh learning summaries without changing the saved answers',async()=>{
 const h=fixture(),{auth}=await admin(h),data=require('../dist/progress-merge.js').blank();data.progress['1.1']={attempts:2,correct:1,last:false,lastAnswer:'A',at:Date.now()};
 await request(h.app).post('/api/progress').auth(auth.token,{type:'bearer'}).send({progressData:data,expectedRevision:0}).expect(200);
 const row=h.raw.prepare('SELECT * FROM ops_learning WHERE user_id=?').get(auth.user.id);assert.equal(row.answered,1);assert.equal(row.attempts,2);assert.equal(row.revision,1);
 const read=await request(h.app).get('/api/progress').auth(auth.token,{type:'bearer'}).expect(200);assert.deepEqual(read.body.progressData,data);
 await request(h.app).post('/api/progress').auth(auth.token,{type:'bearer'}).send({progressData:require('../dist/progress-merge.js').blank(),expectedRevision:1}).expect(200);assert.equal(h.raw.prepare('SELECT answered FROM ops_learning WHERE user_id=?').get(auth.user.id).answered,0);h.raw.close();
});
