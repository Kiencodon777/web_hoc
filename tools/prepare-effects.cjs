// Adapts supplied visual references to the site's buildless runtime.
// Emits a JSON map so the authoring workflow can apply generated files atomically.
const fs=require('fs'),path=require('path'),{stripTypeScriptTypes}=require('node:module');
const base=path.join(__dirname,'../design-references');
const read=n=>fs.readFileSync(path.join(base,n),'utf8').replace(/\r/g,'');
const strip=s=>stripTypeScriptTypes(s,{mode:'strip'}).replace(/^export /gm,'');
let sakura=read('sakura.txt');
let pure=sakura.slice(sakura.indexOf('const ADVANCED_DEFAULTS'),sakura.indexOf('export interface NightSceneBacklitProps'));
pure=pure.replace('flowers: 11000','flowers: 5000').replace('grain: 6','grain: 2');
pure=pure.replace('upload(core: HTMLCanvasElement, blur: HTMLCanvasElement) {','destroy() { gl.deleteTexture(tCore); gl.deleteTexture(tBlur); gl.deleteTexture(tDisp); gl.deleteBuffer(buf); for(const shader of gl.getAttachedShaders(prog)||[]) gl.deleteShader(shader); gl.deleteProgram(prog); },\n        upload(core: HTMLCanvasElement, blur: HTMLCanvasElement) {');
let body=sakura.slice(sakura.indexOf('        const root = rootRef.current'),sakura.indexOf('    }, [])'));
body=body.replace('const root = rootRef.current','const root = rootEl').replace('const canvas = canvasRef.current','const canvas = canvasEl');
body=body.replace('Math.min(2, window.devicePixelRatio || 1)','Math.min(window.innerWidth < 700 ? 1 : 1.5, window.devicePixelRatio || 1)');
body=body.replace('const reduced = !!(mq && mq.matches)','const reduced = !settings.motion || !!(mq && mq.matches)');
body=body.replace('ptr.x = e.offsetX\n            ptr.y = e.offsetY','const rect=root.getBoundingClientRect(); ptr.x=e.clientX-rect.left; ptr.y=e.clientY-rect.top');
body=body.replaceAll('root.addEventListener("pointer','window.addEventListener("pointer').replaceAll('root.removeEventListener("pointer','window.removeEventListener("pointer');
body=body.replace('raf = requestAnimationFrame(frame)\n            const dt','raf = 0; if(document.hidden) return;\n            if (!reduced) raf=requestAnimationFrame(frame);\n            if (last >= 0 && now-last < 32) return;\n            const dt');
body=body.replace('raf = requestAnimationFrame(frame)\n\n        return () => {','raf = requestAnimationFrame(frame)\n        const visibility=()=>{ if(document.hidden){cancelAnimationFrame(raf);raf=0;}else{last=-1;if(!raf)raf=requestAnimationFrame(frame);} };\n        const invalidate=()=>{last=-1;if(!raf)raf=requestAnimationFrame(frame)};\n        const redraw=new ResizeObserver(invalidate);redraw.observe(root);\n        document.addEventListener("visibilitychange",visibility);\n\n        return () => {\n            document.removeEventListener("visibilitychange",visibility); redraw.disconnect(); warp?.destroy();');
let sakuraCode=strip(pure+`\nfunction mountSakura(rootEl:HTMLElement,canvasEl:HTMLCanvasElement,settings:any={}){const propsRef={current:{speed:38,petals:window.innerWidth<700?28:64,wind:20,scale:105,blossomColor:'#C7A4DE',glow:35,background:'#080910',direction:'right',advanced:{flowers:5000,grain:1,swayAmp:4}}};canvasEl.style.transform='scaleX(-1)';\n`+body+'\n}\n');
let particle=read('particle-title.txt');
particle=particle.slice(particle.indexOf('type RGB'),particle.indexOf('/* React component'));
particle=particle.slice(0,particle.lastIndexOf('/* ------------------------------------------------------------------ */'));
particle=particle.replace(`const FONT_STACK = 'Inter,"PingFang SC","Microsoft YaHei",system-ui,sans-serif';`,`const FONT_STACK = '"Be Vietnam Pro",system-ui,sans-serif';`);
particle=particle.replace('const fs = W >= 1100 ? 38 : Math.max(26, Math.min(38, W * 0.05));','const fs = Math.max(40, Math.min(128, W * 0.17));');
particle=particle.replace('const TIMING = { hold: 5200, field: 1400, travel: 4200 };','const TIMING = { hold: 5200, field: 1400, travel: 1750 };');
particle=particle.replace('timer = window.setTimeout(advance, TIMING.hold);','/* The title settles permanently after the entrance. */');
const particleCode=strip(particle+`\nfunction mountParticle(canvas:HTMLCanvasElement,text:string){const engine=createEngine(canvas,text,DARK);return engine;}\n`);
let holo=read('holo-chrome.txt');holo=holo.slice(holo.indexOf('export type HoloChromeColors'),holo.indexOf('function usePrefersReducedMotion'));
holo=holo.replaceAll('smoothstep(0.85, 0.5, kf)','(1.0-smoothstep(0.5,0.85,kf))').replaceAll('smoothstep(vw, vw * 0.3, vd)','(1.0-smoothstep(vw * 0.3,vw,vd))').replaceAll('smoothstep(0.004 + 0.02 * uVeins, 0.0, abs(pinch - 0.3))','(1.0-smoothstep(0.0,0.004 + 0.02 * uVeins,abs(pinch-0.3)))').replaceAll('smoothstep(0.55, 0.32, h)','(1.0-smoothstep(0.32,0.55,h))').replaceAll('smoothstep(1.0, 0.5, vein)','(1.0-smoothstep(0.5,1.0,vein))').replaceAll('smoothstep(0.11, 0.0, length(dp))','(1.0-smoothstep(0.0,0.11,length(dp)))').replaceAll('smoothstep(0.03, 0.0, abs(dp.x) * abs(dp.y) * 30.0)','(1.0-smoothstep(0.0,0.03,abs(dp.x)*abs(dp.y)*30.0))').replaceAll('smoothstep(0.45, 0.0, length(dp))','(1.0-smoothstep(0.0,0.45,length(dp)))').replaceAll('smoothstep(1.35, 0.2, length(uv * vec2(0.8, 1.0)))','(1.0-smoothstep(0.2,1.35,length(uv * vec2(0.8, 1.0))))');
const shaderDriver=`
function mountChrome(root,canvas,settings={}){
 const gl=canvas.getContext('webgl2',{alpha:false,antialias:false,depth:false,powerPreference:'low-power'});if(!gl)return()=>{};
 const program=compile(gl,VERT,FRAG);if(!program)return()=>{};const vao=gl.createVertexArray();let raf=0,last=0,t=9,destroyed=false;
 const palette=HOLO_CHROME_PRESETS.noir,mouse={x:0,y:0},ripples=new Float32Array(24);let slot=0;
 const loc=Object.fromEntries(['uRes','uTime','uMouse','uHover','uDrag','uBase','uShine','uVein','uFilmA','uFilmB','uFilmC','uFlow','uScale','uStretch','uAngle','uIrid','uRidges','uVeins','uSparkle','uTilt','uSmear','uGrain','uVignette','uSeed','uRipples'].map(n=>[n,gl.getUniformLocation(program,n)]));
 function draw(now){raf=0;if(destroyed||document.hidden)return;if(settings.motion&&last&&now-last<40){raf=requestAnimationFrame(draw);return;}let dt=last?Math.min((now-last)/1000,.08):0;last=now;if(settings.motion)t+=dt*.25;const dpr=Math.min(devicePixelRatio||1,1.15);const w=Math.round(root.clientWidth*dpr),h=Math.round(root.clientHeight*dpr);if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h;}gl.viewport(0,0,w,h);gl.useProgram(program);gl.bindVertexArray(vao);gl.uniform2f(loc.uRes,w,h);gl.uniform1f(loc.uTime,t);gl.uniform2f(loc.uMouse,mouse.x,mouse.y);gl.uniform1f(loc.uHover,0.35);gl.uniform2f(loc.uDrag,0,0);for(const [n,c]of Object.entries({uBase:palette.base,uShine:palette.shine,uVein:palette.vein,uFilmA:palette.filmA,uFilmB:palette.filmB,uFilmC:palette.filmC}))gl.uniform3fv(loc[n],hexToRgb(c));for(const [n,v]of Object.entries({uFlow:.65,uScale:1.2,uStretch:2.2,uAngle:.6,uIrid:.6,uRidges:.6,uVeins:.28,uSparkle:.15,uTilt:.4,uSmear:0,uGrain:.15,uVignette:.6,uSeed:3}))gl.uniform1f(loc[n],v);gl.uniform4fv(loc.uRipples,ripples);gl.drawArrays(gl.TRIANGLES,0,3);if(settings.motion)raf=requestAnimationFrame(draw);}
 function kick(){if(!raf&&!document.hidden&&!destroyed)raf=requestAnimationFrame(draw);}
 const move=e=>{mouse.x=(e.clientX-root.clientWidth/2)/root.clientHeight;mouse.y=-(e.clientY-root.clientHeight/2)/root.clientHeight;if(settings.motion)kick();};
 const visibility=()=>{cancelAnimationFrame(raf);raf=0;last=0;if(!document.hidden)kick();};const ro=new ResizeObserver(kick);ro.observe(root);document.addEventListener('visibilitychange',visibility);window.addEventListener('pointermove',move,{passive:true});kick();
 return()=>{destroyed=true;cancelAnimationFrame(raf);ro.disconnect();document.removeEventListener('visibilitychange',visibility);window.removeEventListener('pointermove',move);gl.deleteVertexArray(vao);gl.deleteProgram(program);};
}
`;
const out={};out['dist/scenes-sakura.js']=`/* Adapted from supplied Moonlit Petals / Originkit reference. */\nwindow.KienScenes=window.KienScenes||{};\n(()=>{\n${sakuraCode}\nwindow.KienScenes.sakura=mountSakura;})();`;
out['dist/scenes-particle.js']=`/* Adapted from supplied particle-title reference; single entrance. */\nwindow.KienScenes=window.KienScenes||{};\n(()=>{\n${particleCode}\nwindow.KienScenes.particle=mountParticle;})();`;
out['dist/scenes-chrome.js']=`/* Adapted from supplied Holo Chrome Flow reference. */\nwindow.KienScenes=window.KienScenes||{};\n(()=>{\n${strip(holo)}\n${shaderDriver}\nwindow.KienScenes.chrome=mountChrome;})();`;
process.stdout.write(JSON.stringify(out));
