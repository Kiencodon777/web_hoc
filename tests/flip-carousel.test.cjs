const {test}=require('node:test'),assert=require('node:assert/strict'),vm=require('node:vm'),{readFileSync}=require('node:fs');
function harness(){
 const listeners=new Map(),docListeners=new Map();
 const node=()=>({style:{setProperty(){}},dataset:{},classList:{toggle(){},add(){},remove(){}},setAttribute(k,v){this[k]=v},removeAttribute(k){delete this[k]},focus(){},textContent:''});
 const slots=Array.from({length:3},node),photos=Array.from({length:3},node),holders=Array.from({length:3},node),dots=Array.from({length:3},node),els=new Map();
 const root={...node(),clientWidth:350,querySelectorAll:s=>s==='.flip-slot'?slots:s==='.flip-photo'?photos:s==='.flip-holder'?holders:dots,querySelector:s=>{if(!els.has(s))els.set(s,node());return els.get(s)},getBoundingClientRect(){return{}},addEventListener:(k,f)=>listeners.set(k,f),removeEventListener:k=>listeners.delete(k)};
 let opened=null,motion=true;
 const ctx={window:{KienUI:{motionEnabled:()=>motion}},document:{querySelector:()=>root,addEventListener:(k,f)=>docListeners.set(k,f),removeEventListener:k=>docListeners.delete(k)},SUBJECTS:[{id:'history',title:'History',code:'HIS',count:'362'},{id:'information',title:'Information',code:'INF',count:'199'},{id:'ai',title:'AI',code:'AI',count:'115'}],CSS:{supports:()=>false},ResizeObserver:class{observe(){}disconnect(){}},performance:{now:()=>0},setTimeout:()=>1,clearTimeout(){},openSubject:id=>opened=id};ctx.window.scrollTo=()=>{};
 vm.runInNewContext(readFileSync(__dirname+'/../dist/flip-carousel.js','utf8'),ctx);ctx.window.KienFlip.mount();
 const button=(name,value)=>({disabled:false,dataset:{flipCard:String(value),flipTo:String(value)},hasAttribute:k=>k===name});
 const click=(name,value)=>listeners.get('click')({target:{closest:()=>button(name,value)}});
 const pointer=(type,x,y)=>listeners.get(type)({type,pointerId:1,button:0,clientX:x,clientY:y,target:{closest:()=>true}});
 const key=k=>{let prevented=false;listeners.get('keydown')({key:k,target:{matches:()=>false},preventDefault(){prevented=true}});return prevented};
 return{root,els,click,pointer,key,listeners,docListeners,opened:()=>opened,remount:()=>ctx.window.KienFlip.mount(),motionOff(){motion=false;docListeners.get('kien-motion-change')()}};
}
test('navigation clamps at both ends and opens the selected course',()=>{const h=harness();h.key('End');assert.equal(h.root.dataset.active,'2');assert.equal(h.els.get('[data-flip-next]').disabled,true);h.key('ArrowRight');assert.equal(h.root.dataset.active,'2');h.click('data-flip-open');assert.equal(h.opened(),'ai');h.key('Home');assert.equal(h.els.get('[data-flip-prev]').disabled,true)});
test('vertical and diagonal scrolling does not change the selected course',()=>{for(const [x,y] of [[5,100],[50,100]]){const h=harness();h.pointer('pointerdown',200,200);h.pointer('pointermove',200+x,200+y);h.pointer('pointerup',200+x,200+y);assert.equal(h.root.dataset.active,'0');assert.equal(h.key('ArrowDown'),false)}});
test('horizontal swipe advances once and suppresses the accidental following click',()=>{const h=harness();h.pointer('pointerdown',250,200);h.pointer('pointermove',190,205);h.pointer('pointermove',80,205);assert.equal(h.root.dataset.active,'1');h.pointer('pointerup',80,205);h.click('data-flip-card',1);assert.equal(h.opened(),null);h.click('data-flip-next');assert.equal(h.root.dataset.active,'2')});
test('remount resets selection and keeps one set of handlers; motion off stays navigable',()=>{const h=harness();h.key('End');h.remount();assert.equal(h.root.dataset.active,'0');assert.equal(h.listeners.size,7);assert.equal(h.docListeners.size,1);h.motionOff();h.click('data-flip-next');assert.equal(h.root.dataset.active,'1')});
