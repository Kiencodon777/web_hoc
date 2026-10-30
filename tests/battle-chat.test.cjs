const {test}=require('node:test'),assert=require('node:assert/strict'),vm=require('node:vm'),fs=require('node:fs');
test('chat groups by account ID, keeps real profile avatars and escapes every message/name',()=>{
 const source=fs.readFileSync(__dirname+'/../dist/battle-ui.js','utf8'),chat=source.slice(source.indexOf(' function chat(){'),source.indexOf(' function voiceWidget()'));
 const room={code:'ABC234',players:[{id:'a',name:'<owner>',avatar:'uploaded-png'},{id:'b',name:'same name'}],chat:[{userId:'a',name:'same name',text:'<script>secret</script>',at:1},{userId:'a',name:'changed name',text:'Second line',at:2},{userId:'b',name:'same name',text:'Other account',at:3}]};
 const escape=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const context={room,user:{id:'a'},socket:{readyState:1},draft:'"<draft>',esc:escape,icon:()=>'',avatar:p=>'<span class="test-avatar">'+escape(p.avatar||p.id)+'</span>'};
 vm.createContext(context);const html=vm.runInContext(chat+'\nchat()',context);assert.equal((html.match(/<article /g)||[]).length,2);assert(html.includes('uploaded-png'));assert(html.includes('&lt;script&gt;secret&lt;/script&gt;'));assert(!html.includes('<owner>'));assert(html.includes('&lt;owner&gt;'));assert(html.includes('Second line'));
});
test('bundled fallback avatars are stable, distinct, locally generated and do not interpolate seed HTML',()=>{
 const window={};vm.runInNewContext(fs.readFileSync(__dirname+'/../dist/pk-avatar.js','utf8'),{window,TextEncoder});const a=window.KienPKAvatar('a'),b=window.KienPKAvatar('b');assert.equal(a,window.KienPKAvatar('a'));assert.notEqual(a,b);assert(a.startsWith('<svg'));assert(!window.KienPKAvatar('<script>alert(1)</script>').includes('<script>'));assert(!a.includes('https://blobatar.dev'));
});
