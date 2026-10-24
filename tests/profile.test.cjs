const {test}=require('node:test'),assert=require('node:assert/strict'),request=require('supertest'),fs=require('node:fs'),vm=require('node:vm');
const {createApp}=require('../server/app.cjs'),{openDatabase}=require('../server/database.cjs'),{validAvatar,profileInput}=require('../server/profile.cjs'),{png}=require('./avatar-fixture.cjs');
const avatar='data:image/png;base64,'+png().toString('base64');
test('avatar validator bounds decoded pixels/bytes and rejects URLs, SVG, malformed and animated payloads',()=>{assert(validAvatar(avatar));assert(validAvatar(null));for(const value of ['https://example.com/a.png','data:image/svg+xml;base64,PHN2Zz4=',avatar.slice(0,-5),'data:image/png;base64,'+png(257,1).toString('base64'),'data:image/png;base64,'+'A'.repeat(132000),42])assert(!validAvatar(value));assert.equal(profileInput({username:' Du\u0303ng  Phạm ',avatar:null,expectedRevision:0}).username,'Dũng Phạm');for(const username of ['a','x'.repeat(33),'<script>alert(1)</script>','A\u202eB','A\u0000B'])assert.throws(()=>profileInput({username,avatar:null,expectedRevision:0}));});
test('profile API persists account-specific names/avatars, handles skips/removal/conflicts and retains progress',async()=>{
 const db=openDatabase(':memory:'),codes=[];const {app}=createApp({db,config:{JWT_SECRET:'test-only-'+ 'x'.repeat(48)},sendMail:async(email,code)=>codes.push(code)}),api=request(app);
 const login=async email=>{await api.post('/api/auth/send-otp').send({email}).expect(200);return (await api.post('/api/auth/verify-otp').send({email,code:codes.at(-1)}).expect(200)).body;};
 try{const a=await login('profile-a@example.invalid'),b=await login('profile-b@example.invalid'),auth='Bearer '+a.token;
 assert.equal(a.user.profileCompleted,false);await api.post('/api/auth/profile').send({username:'No auth',avatar,expectedRevision:0}).expect(401);
 for(const payload of [{username:'<img>',avatar,expectedRevision:0},{username:'Dũng',avatar:'data:image/svg+xml;base64,PHN2Zz4=',expectedRevision:0},{username:'Dũng',avatar}])await api.post('/api/auth/profile').set('Authorization',auth).send(payload).expect(400);
 const saved=(await api.post('/api/auth/profile').set('Authorization',auth).send({username:' Dũng Phạm ',avatar,expectedRevision:0,user_id:b.user.id,hasPassword:true}).expect(200)).body.user;
 assert.equal(saved.username,'Dũng Phạm');assert.equal(saved.avatar,avatar);assert.equal(saved.hasPassword,false);assert.equal(saved.profileCompleted,true);
 const second=(await api.get('/api/auth/me').set('Authorization',auth).expect(200)).body.user;assert.deepEqual(second,saved);
 const other=(await api.get('/api/auth/me').set('Authorization','Bearer '+b.token).expect(200)).body.user;assert.equal(other.username,'');assert.equal(other.avatar,null);
 const conflict=(await api.post('/api/auth/profile').set('Authorization',auth).send({username:'Stale',avatar:null,expectedRevision:0}).expect(409)).body;assert.equal(conflict.user.username,'Dũng Phạm');
 await api.post('/api/auth/set-password').set('Authorization',auth).send({password:'test-only-profile-password'}).expect(200).then(r=>assert.equal(r.body.user.avatar,avatar));
 await api.post('/api/auth/profile').set('Authorization',auth).send({username:'Dũng Phạm',avatar:null,expectedRevision:1}).expect(200).then(r=>assert.equal(r.body.user.avatar,null));
 await api.post('/api/auth/profile').set('Authorization','Bearer '+b.token).send({skip:true,expectedRevision:0}).expect(200).then(r=>{assert.equal(r.body.user.profileCompleted,true);assert.equal(r.body.user.username,'')});
 const reLogin=(await api.post('/api/auth/password-login').send({email:a.user.email,password:'test-only-profile-password'}).expect(200)).body;assert.equal(reLogin.user.username,'Dũng Phạm');assert.equal(reLogin.user.profileRevision,2);
 }finally{db.close();}
});
test('profile renderer escapes names, excludes unsafe image sources and presents optional onboarding',()=>{const win={};vm.runInNewContext(fs.readFileSync('dist/profile-ui.js','utf8'),{window:win});assert(!win.KienProfile.avatar({username:'<img src=x>',avatar:'javascript:alert(1)'}).includes('<img'));const markup=win.KienProfile.begin({id:'a',username:'A" onclick="alert(1)',avatar:null},true);assert(markup.includes('&quot;'));assert(markup.includes('data-profile-skip'));assert(!win.KienProfile.begin({id:'a',username:'Dũng'},false).includes('data-profile-skip'));});
