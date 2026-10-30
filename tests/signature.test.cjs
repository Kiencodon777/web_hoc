const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
function harness(){
 const events=new Map(),observers=[],batches=[];let root=null,motion=true;
 const document={hidden:false,querySelector:()=>root,addEventListener:(name,fn)=>events.set(name,fn),removeEventListener:name=>events.delete(name)};
 const window={KienPhysics:{},KienUI:{motionEnabled:()=>motion}};
 vm.runInNewContext(fs.readFileSync(__dirname+'/../dist/signature.js','utf8'),{window,document,IntersectionObserver:class{constructor(fn){this.fn=fn;observers.push(this)}observe(){}disconnect(){this.disconnected=true}}});
 function mount(){const batch=[];root={querySelectorAll:()=>[...window.KienV9.wordmark().matchAll(/data-start="([^"]+)" data-duration="([^"]+)"/g)].map(([,start,duration])=>({dataset:{start,duration},animate(_,timing){const a={timing,currentTime:0,playState:'running',cancels:0,pause(){this.playState='paused'},play(){this.playState='running'},cancel(){this.cancels++;this.playState='idle'}};batch.push(a);return a;}}))};batches.push(batch);window.KienV9.afterRender();return batch;}
 return{window,document,events,observers,mount,visible(value){observers.at(-1).fn([{isIntersecting:value}])},time(t){batches.at(-1).forEach(a=>a.currentTime=t)},refresh(){window.KienV9.afterRender()},motion(value){motion=value;events.get('kien-motion-change')?.()},remove(){root=null;window.KienV9.afterRender()}};
}
test('refresh and theme notifications cannot cancel the remaining Hoc strokes on the same title',()=>{
 const h=harness(),animations=h.mount();assert.equal(animations.length,17);h.visible(true);h.time(3000);
 h.refresh();h.motion(true);assert.equal(h.observers.length,1);assert(animations.every(a=>a.cancels===0&&a.playState==='running'));
 assert(animations.some(a=>a.timing.delay>=3150));assert.equal(animations.at(-1).timing.delay+animations.at(-1).timing.duration,6500);
});
test('a replaced title resumes its shared playhead instead of revealing Hoc immediately',()=>{
 const h=harness(),old=h.mount();h.visible(true);h.time(2900);const next=h.mount();
 assert(old.every(a=>a.cancels===1));assert(next.every(a=>a.currentTime===2900&&a.playState==='paused'));h.visible(true);assert(next.every(a=>a.playState==='running'));
 next.at(-1).onfinish();h.remove();assert.equal(h.events.size,0);const final=h.mount();assert.equal(final.length,0,'completed title stays readable without replaying');
});
test('offscreen/hidden title pauses all strokes and reduced motion reveals the complete title',()=>{
 const h=harness(),a=h.mount();assert(a.every(x=>x.playState==='paused'));h.visible(true);h.time(3200);h.visible(false);assert(a.every(x=>x.playState==='paused'));
 h.visible(true);h.document.hidden=true;h.events.get('visibilitychange')();assert(a.every(x=>x.playState==='paused'));h.document.hidden=false;h.events.get('visibilitychange')();assert(a.every(x=>x.playState==='running'));
 h.motion(false);assert(a.every(x=>x.cancels===1));h.remove();assert.equal(h.events.size,0);
});
