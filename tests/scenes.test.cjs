const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
function harness({motion=true,fine=false,coarse=false}={}){
 const frames=new Map(),observers=[],objects=[],winEvents=new Map(),docEvents=new Map(),revoked=[];let serial=0,webglRequests=0,draws=0,strokes=0;
 function element(tag='canvas'){
  const events=new Map();let w=300,h=150,writes=0;
  const node={tagName:tag.toUpperCase(),style:{},events,setAttribute(){},remove(){this.removed=true},toBlob(fn){fn({})},addEventListener:(k,f)=>events.set(k,f),removeEventListener:k=>events.delete(k),get writes(){return writes},get width(){return w},set width(x){w=x;writes++},get height(){return h},set height(x){h=x;writes++}};
  const ctx=new Proxy({createPattern:()=>({}),createImageData:(x,y)=>({data:new Uint8ClampedArray(x*y*4)}),createLinearGradient:()=>({addColorStop(){}}),createRadialGradient:()=>({addColorStop(){}}),stroke(){strokes++},drawImage(){draws++;}}, {get:(o,k)=>k in o?o[k]:()=>{}});
  node.getContext=type=>{if(type!=='2d'){webglRequests++;return null;}return ctx;};objects.push(node);return node;
 }
 const root={clientWidth:412,clientHeight:900,get offsetWidth(){return this.clientWidth},get offsetHeight(){return this.clientHeight},insertBefore(el){this.fallback=el},getBoundingClientRect:()=>({left:0,top:0})},canvas=element();
 const win={innerWidth:412,devicePixelRatio:3,matchMedia:q=>({matches:q.includes('hover')?fine:q.includes('coarse')?coarse:false}),addEventListener:(k,f)=>winEvents.set(k,f),removeEventListener:k=>winEvents.delete(k)};
 const doc={hidden:false,createElement:element,addEventListener:(k,f)=>docEvents.set(k,f),removeEventListener:k=>docEvents.delete(k)};
 const context={performance:{now:()=>100},window:win,document:doc,ResizeObserver:class{constructor(f){this.f=f;observers.push(this)}observe(){}disconnect(){this.disconnected=true}},URL:{createObjectURL:()=>`blob:${++serial}`,revokeObjectURL:u=>revoked.push(u)},requestAnimationFrame:f=>{const n=++serial;frames.set(n,f);return n},cancelAnimationFrame:n=>frames.delete(n)};
 vm.runInNewContext(fs.readFileSync(__dirname+'/../dist/scene-runtime.js','utf8'),context);vm.runInNewContext(fs.readFileSync(__dirname+'/../dist/scenes-sakura.js','utf8'),context);
 const dispose=win.KienScenes.sakura(root,canvas,{motion});
 return{context,root,canvas,win,doc,frames,observers,objects,winEvents,docEvents,revoked,dispose,get webglRequests(){return webglRequests},get strokes(){return strokes},get draws(){return draws},frame(t=100){const [id,f]=frames.entries().next().value||[];assert(f,'Expected a scheduled frame');frames.delete(id);f(t)},resize(){observers.forEach(o=>o.f())}};
}
test('Sakura resize does not clear the visible bitmap until the replacement can paint',()=>{const h=harness({motion:false});h.frame();const oldWidth=h.canvas.width,writes=h.canvas.writes,draws=h.draws;h.root.clientWidth=900;h.root.clientHeight=412;h.resize();assert.equal(h.canvas.width,oldWidth);assert.equal(h.canvas.writes,writes);h.frame(102);assert.equal(h.canvas.width,900);assert(h.draws>draws);h.dispose();});
test('unchanged root size ignores address-bar resize events, including rapid bounce',()=>{const h=harness({motion:false});h.frame();const count=h.objects.length,writes=h.canvas.writes;for(let i=0;i<30;i++){h.win.innerHeight=700+i;h.winEvents.get('resize')();h.resize()}assert.equal(h.frames.size,0);assert.equal(h.objects.length,count);assert.equal(h.canvas.writes,writes);h.root.clientHeight=800;h.resize();h.root.clientHeight=900;h.resize();h.frame();assert.equal(h.canvas.height,900);h.dispose();});
test('touch scrolling never allocates a WebGL warp and does not activate mouse hover',()=>{const h=harness();h.frame();for(let i=0;i<10;i++){h.winEvents.get('pointerdown')({pointerType:'touch',clientX:100,clientY:100});h.winEvents.get('pointermove')({pointerType:'touch',clientX:100,clientY:200+i});h.frame(140+i*40)}assert.equal(h.webglRequests,0);h.dispose();const mouse=harness({fine:true,motion:false});mouse.frame();assert.equal(mouse.webglRequests,0);mouse.dispose();});
test('2D context loss retains a flower snapshot, restores, and cleans all resources',()=>{const h=harness({motion:false});h.frame();h.canvas.events.get('contextlost')();assert.equal(h.root.fallback.style.display,'block');assert.equal(h.canvas.style.visibility,'hidden');assert.equal(h.frames.size,0);h.canvas.events.get('contextrestored')();h.frame(200);assert.equal(h.canvas.style.visibility,'');assert.equal(h.root.fallback.style.display,'none');h.dispose();assert(h.root.fallback.removed);assert.equal(h.canvas.events.size,0);assert.equal(h.winEvents.size,0);assert.equal(h.docEvents.size,0);assert.equal(h.frames.size,0);assert(h.observers.every(o=>o.disconnected));assert(h.revoked.length>=1);});
test('hidden tabs stop rendering and re-entry redraws even with motion off',()=>{const h=harness({motion:false});h.frame();h.doc.hidden=true;h.docEvents.get('visibilitychange')();assert.equal(h.frames.size,0);h.doc.hidden=false;h.docEvents.get('visibilitychange')();h.frame(200);assert.equal(h.frames.size,0);h.dispose();});
test('all canvas scenes cap resolution and the fixed stage uses stable large viewport units',()=>{const h=harness({motion:false});for(const [w,hh]of [[412,932],[1920,1080],[3840,2160],[16000,100]]){h.root.clientWidth=w;h.root.clientHeight=hh;const s=h.win.KienScenes.surfaceSize(h.root);assert(s.width*s.height<=1600000);assert(s.width<=4096&&s.height<=4096);}assert(fs.readFileSync(__dirname+'/../dist/night.css','utf8').includes('height:100lvh'));h.dispose();});

test('Chrome recompiles GPU resources after context restore and releases its listeners',()=>{const h=harness();h.dispose();let programs=0,draws=0,prevented=false;const gl=new Proxy({createProgram:()=>({id:++programs}),createShader:()=>({}),getShaderParameter:()=>true,getProgramParameter:()=>true,createVertexArray:()=>({}),getUniformLocation:(_,n)=>n,isContextLost:()=>false,drawArrays(){draws++}}, {get:(o,k)=>k in o?o[k]:()=>{}});h.canvas.getContext=()=>gl;vm.runInNewContext(fs.readFileSync(__dirname+'/../dist/scenes-chrome.js','utf8'),h.context);const end=h.win.KienScenes.chrome(h.root,h.canvas,{motion:true});h.frame(100);assert.equal(draws,1);h.canvas.events.get('webglcontextlost')({preventDefault(){prevented=true}});assert(prevented);assert.equal(h.frames.size,0);h.canvas.events.get('webglcontextrestored')();h.frame(200);assert.equal(programs,2);assert.equal(draws,2);end();assert.equal(h.canvas.events.size,0);assert.equal(h.frames.size,0);});
test('Grid redraws after 2D restoration and ignores interaction during context loss',()=>{const h=harness();h.dispose();const s=fs.readFileSync(__dirname+'/../dist/night-ui.js','utf8'),a=s.indexOf(' function gridScene('),b=s.indexOf(' function applyAppearance()',a);vm.runInNewContext(s.slice(a,b)+';window.testGrid=gridScene;',h.context);const end=h.win.testGrid(h.root,h.canvas,{motion:true}),strokes=h.strokes;h.canvas.events.get('contextlost')();h.winEvents.get('pointermove')({clientX:100,clientY:100});assert.equal(h.frames.size,0);h.canvas.events.get('contextrestored')();assert(h.strokes>strokes);end();assert.equal(h.canvas.events.size,0);assert.equal(h.frames.size,0);});

test('landscape GPU lifecycle bounds pixels, preserves buffers on mobile resize, pauses and releases resources',()=>{
 const h=harness();h.dispose();let deletes=0,draws=0,builds=0,resizes=0;
 const gl={createBuffer:()=>({}),deleteBuffer(){deletes++},getExtension:()=>null};
 h.canvas.getContext=()=>gl;
 vm.runInNewContext(fs.readFileSync(__dirname+'/../dist/scene-gpu-stage.js','utf8'),h.context);
 const factory=tracked=>{builds++;tracked.createBuffer();return {resize(){resizes++},draw(){draws++}}};
 const end=h.win.KienScenes.gpuStage(h.root,h.canvas,{motion:false},factory);h.frame(100);assert.equal(draws,1);assert.equal(h.frames.size,0);assert(h.canvas.width*h.canvas.height<=900000);
 const writes=h.canvas.writes;for(let i=0;i<20;i++){h.win.innerHeight=500+i;h.resize();}assert.equal(h.canvas.writes,writes);assert.equal(h.frames.size,0);assert.equal(resizes,1);
 h.doc.hidden=true;h.docEvents.get('visibilitychange')();assert.equal(h.frames.size,0);h.doc.hidden=false;h.docEvents.get('visibilitychange')();h.frame(200);assert.equal(draws,2);
 let prevented=false;h.canvas.events.get('webglcontextlost')({preventDefault(){prevented=true}});assert(prevented);assert.equal(h.canvas.style.visibility,'hidden');assert.equal(h.frames.size,0);
 h.canvas.events.get('webglcontextrestored')();h.frame(300);assert.equal(builds,2);assert.equal(h.canvas.style.visibility,'');assert.equal(draws,3);
 end();assert.equal(deletes,1);assert.equal(h.frames.size,0);assert.equal(h.canvas.events.size,0);assert.equal(h.docEvents.size,0);assert(h.observers.every(o=>o.disconnected));
});
test('failed landscape shader releases partial allocations and retains the CSS fallback',()=>{
 const h=harness();h.dispose();let deleted=0;h.context.console={warn(){}};h.canvas.getContext=()=>({createProgram:()=>({}),deleteProgram(){deleted++},getExtension:()=>null});
 vm.runInNewContext(fs.readFileSync(__dirname+'/../dist/scene-gpu-stage.js','utf8'),h.context);
 const end=h.win.KienScenes.gpuStage(h.root,h.canvas,{motion:true},gl=>{gl.createProgram();throw new Error('compile failed')});assert.equal(deleted,1);assert.equal(h.canvas.style.visibility,'hidden');assert.equal(h.frames.size,0);end();assert.equal(h.canvas.events.size,0);
});

test('moving landscapes throttle paints, ignore touch pointers and stop completely in hidden tabs',()=>{
 const h=harness();h.dispose();let paints=0,moves=0;h.canvas.getContext=()=>({getExtension:()=>null});
 vm.runInNewContext(fs.readFileSync(__dirname+'/../dist/scene-gpu-stage.js','utf8'),h.context);
 const end=h.win.KienScenes.gpuStage(h.root,h.canvas,{motion:true},()=>({resize(){},draw(){paints++},move(){moves++}}));
 h.frame(100);h.frame(120);assert.equal(paints,1);h.frame(150);assert.equal(paints,2);
 h.winEvents.get('pointermove')({pointerType:'touch',clientX:1,clientY:2});assert.equal(moves,0);
 h.winEvents.get('pointermove')({pointerType:'mouse',clientX:1,clientY:2});assert.equal(moves,1);
 h.doc.hidden=true;h.docEvents.get('visibilitychange')();assert.equal(h.frames.size,0);h.winEvents.get('pointermove')({pointerType:'mouse',clientX:1,clientY:2});assert.equal(moves,1);
 end();assert.equal(h.winEvents.size,0);assert.equal(h.docEvents.size,0);assert.equal(h.canvas.events.size,0);
});

function reelHarness(options={}){
 const h=harness(options);h.dispose();let uploads=0,draws=0,deletes=0,id=0,mipmaps=0,contextOptions;const images=[],fallback=[],cards=[];
 const gl=new Proxy({createProgram:()=>({id:++id}),createShader:()=>({id:++id}),createBuffer:()=>({id:++id}),createTexture:()=>({id:++id}),getShaderParameter:()=>true,getProgramParameter:()=>true,getAttribLocation:()=>0,getUniformLocation:(_,name)=>name,getExtension:()=>null,texImage2D(){uploads++},drawElements(){draws++},deleteProgram(){deletes++},deleteShader(){deletes++},deleteBuffer(){deletes++},deleteTexture(){deletes++}}, {get:(o,k)=>k in o?o[k]:()=>{}});
 gl.generateMipmap=()=>{mipmaps++};
 h.canvas.getContext=(_,options)=>{contextOptions=options;return gl};h.context.Image=class{constructor(){images.push(this);this.naturalWidth=this.naturalHeight=1024}set src(value){this.url=value}};
 for(const file of ['ui-physics.js','scene-gpu-stage.js','curved-reel.js'])vm.runInNewContext(fs.readFileSync(__dirname+'/../dist/'+file,'utf8'),h.context);
 const controller=h.win.KienReel.mount(h.root,h.canvas,['one','two','three'],value=>cards.push(value),value=>fallback.push(value));
 return {...h,controller,images,fallback,cards,get contextOptions(){return contextOptions},get mipmaps(){return mipmaps},get uploads(){return uploads},get draws(){return draws},get deletes(){return deletes},async load(batch=images.slice(-3)){batch.forEach(image=>image.onload?.());await Promise.resolve();await Promise.resolve();}};
}
test('reel draws every display frame on mouse and touch, with retina pixels and filtered textures',async()=>{
 for(const coarse of [false,true]){
  const h=reelHarness({coarse});await h.load();h.frame(100);
  assert.equal(h.contextOptions.antialias,true);assert.equal(h.mipmaps,3);
  assert(h.canvas.width>h.root.clientWidth);assert(h.canvas.width*h.canvas.height<=4000000);
  let reads=0;const width=h.root.clientWidth;Object.defineProperty(h.root,'clientWidth',{get(){reads++;return width}});
  h.controller.pause(false);const before=h.draws;
  for(let i=1;i<=60;i++)h.frame(100+i*1000/60);
  assert.equal(h.cards.length,61);assert(h.draws>before);assert.equal(reads,0,'animation must not read layout each frame');
  h.controller.pause(true);h.frame(1200);assert.equal(h.frames.size,0);
  const paused=JSON.stringify(h.cards.at(-1));h.controller.pause(false);h.frame(12000);
  assert.equal(JSON.stringify(h.cards.at(-1)),paused,'resume must not jump across time spent paused');h.controller.destroy();
 }
});
test('continuous reel uses shared canvas geometry; wheel-offset/unchanged resize never reallocates the bitmap',async()=>{
 const h=reelHarness();await h.load();h.frame(100);assert.equal(h.uploads,3);assert(h.draws>0);const writes=h.canvas.writes,position=JSON.stringify(h.cards.at(-1));
 for(let offset=0;offset<30;offset++){h.root.getBoundingClientRect=()=>({left:0,top:-offset*11});h.resize();}assert.equal(h.canvas.writes,writes);assert.equal(h.frames.size,0);assert.equal(JSON.stringify(h.cards.at(-1)),position);
 h.controller.step(1);h.frame(200);assert.notEqual(JSON.stringify(h.cards.at(-1)),position);h.controller.pause(false);h.frame(300);assert.equal(h.frames.size,1);h.controller.pause(true);h.frame(400);assert.equal(h.frames.size,0);h.controller.destroy();assert.equal(h.deletes,8);assert.equal(h.frames.size,0);assert.equal(h.canvas.events.size,0);
});
test('reel recolors only the newest complete image batch without resetting its position',async()=>{
 const h=reelHarness();await h.load();h.frame(100);h.controller.step(1);h.frame(200);const before=JSON.stringify(h.cards.at(-1)),old=h.uploads;
 h.controller.setAssets(['old-a','old-b','old-c']);const stale=h.images.slice(-3);h.controller.setAssets(['new-a','new-b','new-c']);await h.load(stale);assert.equal(h.uploads,old);await h.load();h.frame(300);assert.equal(h.uploads,old+3);assert.equal(JSON.stringify(h.cards.at(-1)),before);h.controller.destroy();
});
test('reel falls back on context loss, restores fresh textures, and discards pending images after cleanup',async()=>{
 const h=reelHarness();await h.load();h.frame(100);h.canvas.events.get('webglcontextlost')({preventDefault(){}});assert.equal(h.fallback.at(-1),true);assert.equal(h.frames.size,0);
 h.canvas.events.get('webglcontextrestored')();await h.load();h.frame(200);assert.equal(h.fallback.at(-1),false);assert.equal(h.uploads,6);
 h.controller.setAssets(['later-a','later-b','later-c']);const batch=h.images.slice(-3),uploads=h.uploads;h.controller.destroy();await h.load(batch);assert.equal(h.uploads,uploads);assert.equal(h.frames.size,0);
});
test('reel card positions stay finite, bounded and select valid subjects across loop seams and reverse steps',()=>{
 const h=harness();h.dispose();vm.runInNewContext(fs.readFileSync(__dirname+'/../dist/ui-physics.js','utf8'),h.context);vm.runInNewContext(fs.readFileSync(__dirname+'/../dist/curved-reel.js','utf8'),h.context);
 for(const width of [320,390,768,1280,1920]){const g=h.win.KienPhysics.measure(width,440);for(const phase of [-100.1,-1,0,.01,1,3,100.3])for(let slot=0;slot<g.columns;slot++){const c=h.win.KienReel.cardState(g,phase,slot,3,width,440);assert(c.index>=0&&c.index<3);for(const k of ['left','top','width','height','angle'])assert(Number.isFinite(c[k]));assert(c.left>=0&&c.left+c.width<=width+.001);assert(c.top>=0&&c.top+c.height<=440+.001);}}
});

test('unavailable GPU keeps the native course grid usable without allocating a render loop',()=>{
 const h=harness();h.dispose();for(const file of ['scene-gpu-stage.js','curved-reel.js'])vm.runInNewContext(fs.readFileSync(__dirname+'/../dist/'+file,'utf8'),h.context);
 const fallback=[];const controller=h.win.KienReel.mount(h.root,h.canvas,['one','two'],()=>assert.fail('unsupported GPU must not publish hit targets'),value=>fallback.push(value));assert.equal(fallback.at(-1),true);controller.pause(false);controller.step(1);controller.setAssets(['new','new']);assert.equal(h.frames.size,0);controller.destroy();assert.equal(h.canvas.events.size,0);
});
