const {readFileSync}=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const ctx={window:{}};vm.runInNewContext(readFileSync(__dirname+'/../dist/ui-physics.js','utf8'),ctx);const P=ctx.window.KienPhysics;
assert.equal(P.influence(0),1);assert.equal(P.influence(151),0);assert.equal(P.influence(-75),P.influence(75));
// Low-mass Framer spring converges with common refresh rates and delayed frames.
for(const dt of [1/30,1/60,1/120,.2]){let x=0,v=0;for(let i=0;i<300;i++){({x,v}=P.step(x,v,1,dt));assert(Number.isFinite(x)&&x>-1&&x<2);}assert(Math.abs(1-x)<.001);for(let i=0;i<300;i++)({x,v}=P.step(x,v,0,dt));assert(Math.abs(x)<.001);}
// All curves put the loop seam beyond the visible arc and cap mobile tile size.
for(const width of [320,390,768,1280,1920]){const g=P.measure(width,480);assert(g&&g.columns>=2&&g.columns<=60);assert(g.sweep>=g.limit);assert(g.h*1.12<=width*.55+.001);assert(g.radius>0);}
assert.equal(P.measure(0,0),null);
// Workswheel keeps the front face at the picture plane and sizes the ring to its cards.
for(const w of [320,390,520,960]){const g=P.wheelMetrics(w,500,3);assert(g.cardW<=w*.34+.001);assert.equal(g.cardW/g.cardH,1.45);assert.equal(g.drumR,g.cardH*2.22);assert(g.ringScale>=.16&&g.ringScale<=1);assert(g.depth>g.drumR);assert(P.wheelPlace(0,0,g.ringR,g.drumR,g.bow,1).includes(`translateZ(${g.drumR}px)`));}
assert.equal(P.gaussian(0),1);assert.equal(P.gaussian(-86),P.gaussian(86));assert(P.gaussian(172)<P.gaussian(86));
console.log('PASS: distance influence, spring convergence at 30/60/120Hz and frame stalls, cylindrical geometry from phone to ultrawide.');
