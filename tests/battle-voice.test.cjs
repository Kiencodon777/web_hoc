const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const source=fs.readFileSync(__dirname+'/../dist/battle-voice.js','utf8');
function fixture(){let permission,ice,stopped=0;const sent=[],track={enabled:true,stop(){stopped++;}},stream={getTracks:()=>[track],getAudioTracks:()=>[track]},window={PK_CONFIG:{preview:true}};
 vm.runInNewContext(source,{window,navigator:{mediaDevices:{getUserMedia:()=>new Promise(r=>permission=r)}},fetch:()=>new Promise(r=>ice=r),AudioContext:class{createAnalyser(){return{fftSize:0,getByteTimeDomainData(){}};}createMediaStreamSource(){return{connect(){},disconnect(){}};}close(){return Promise.resolve();}},document:{hidden:false,querySelectorAll:()=>[]},setInterval:()=>1,clearInterval(){},Uint8Array});
 const voice=new window.KienBattleVoice(m=>sent.push(m),()=>{});return{voice,sent,track,stream,allow:()=>permission(stream),ice:()=>ice({ok:true,json:async()=>({iceServers:[],relay:false})}),stopped:()=>stopped};
}
test('leaving before microphone permission resolves stops the late stream without joining voice',async()=>{const h=fixture(),pending=h.voice.join('ABC234','a');await h.voice.leave();h.allow();await pending;assert.equal(h.stopped(),1);assert.equal(h.voice.stream,null);assert(!h.sent.some(m=>m.joined));});
test('leaving during ICE lookup cannot rejoin voice; a normal join starts muted and leave stops tracks',async()=>{
 const h=fixture(),pending=h.voice.join('ABC234','a');h.allow();await new Promise(setImmediate);await h.voice.leave();h.ice();await pending;assert.equal(h.voice.stream,null);assert(!h.sent.some(m=>m.joined));
 const n=fixture(),join=n.voice.join('ABC234','a');n.allow();await new Promise(setImmediate);n.ice();await join;assert.equal(n.track.enabled,false);assert.equal(n.sent.at(-1).muted,true);n.voice.toggle();assert.equal(n.track.enabled,true);await n.voice.leave();assert.equal(n.track.enabled,true);assert.equal(n.stopped(),1);assert.equal(n.sent.at(-1).joined,false);
});
