'use strict';
// Shared lifecycle for the two landscape adapters. The fixed root, never the
// shrinking mobile visual viewport, determines the backing bitmap dimensions.
(()=>{
 window.KienScenes.gpuStage=function(root,canvas,settings={},factory){
  const gl=canvas.getContext('webgl',{alpha:true,antialias:false,depth:false,powerPreference:'low-power'});
  if(!gl){canvas.style.visibility='hidden';return()=>{};}
  const coarse=window.matchMedia('(pointer: coarse)').matches,interval=coarse?1000/15:1000/24;
  let renderer,resources=[],raf=0,last=0,time=9000,size='',stopped=false,lost=false;
  const kinds={createShader:'deleteShader',createProgram:'deleteProgram',createBuffer:'deleteBuffer',createTexture:'deleteTexture'};
  const methods=new Map(),tracked=new Proxy(gl,{get(target,key){
   const value=target[key];if(typeof value!=='function')return value;
   if(!methods.has(key))methods.set(key,(...args)=>{const result=value.apply(target,args);if(kinds[key]&&result)resources.push([kinds[key],result]);return result;});
   return methods.get(key);
  }});
  function release(){for(const [method,value]of resources)gl[method](value);resources=[];renderer=null;}
  function initialize(){try{renderer=factory(tracked);size='';canvas.style.visibility='';}catch(error){release();canvas.style.visibility='hidden';console.warn('Landscape fallback:',error.message);}}
  function draw(now){
   raf=0;if(stopped||lost||document.hidden||!renderer)return;
   if(settings.motion&&last&&now-last<interval){kick();return;}
   if(settings.motion&&last)time+=Math.min(now-last,100);last=now;
   const pixels=window.KienScenes.surfaceSize(root,1,coarse?600000:900000);if(!pixels)return;
   const next=pixels.width+'x'+pixels.height;
   if(next!==size){if(canvas.width!==pixels.width)canvas.width=pixels.width;if(canvas.height!==pixels.height)canvas.height=pixels.height;renderer.resize(pixels);size=next;}
   renderer.draw(time,pixels);if(settings.motion)kick();
  }
  function kick(){if(!raf&&!stopped&&!lost&&!document.hidden&&renderer)raf=requestAnimationFrame(draw);}
  const resize=()=>{const p=window.KienScenes.surfaceSize(root,1,coarse?600000:900000);if(p&&p.width+'x'+p.height!==size)kick();};
  const visibility=()=>{cancelAnimationFrame(raf);raf=0;last=0;kick();};
  const contextLost=e=>{e.preventDefault();lost=true;cancelAnimationFrame(raf);raf=0;canvas.style.visibility='hidden';};
  const contextRestored=()=>{if(stopped)return;resources=[];initialize();lost=false;last=0;kick();};
  // Mouse interactions are decorative. Touch scrolling never enters this path.
  const pointer=(method,event)=>{if(!settings.motion||coarse||event.pointerType==='touch'||document.hidden||lost||stopped)return;const rect=root.getBoundingClientRect();renderer?.[method]?.(event.clientX-rect.left,event.clientY-rect.top);};
  const move=e=>pointer('move',e),down=e=>pointer('down',e),leave=()=>renderer?.leave?.();
  initialize();
  const observer=new ResizeObserver(resize);observer.observe(root);
  document.addEventListener('visibilitychange',visibility);
  window.addEventListener('pointermove',move,{passive:true});window.addEventListener('pointerdown',down,{passive:true});window.addEventListener('blur',leave);
  canvas.addEventListener('webglcontextlost',contextLost);canvas.addEventListener('webglcontextrestored',contextRestored);kick();
  return()=>{stopped=true;cancelAnimationFrame(raf);observer.disconnect();document.removeEventListener('visibilitychange',visibility);window.removeEventListener('pointermove',move);window.removeEventListener('pointerdown',down);window.removeEventListener('blur',leave);canvas.removeEventListener('webglcontextlost',contextLost);canvas.removeEventListener('webglcontextrestored',contextRestored);release();gl.getExtension('WEBGL_lose_context')?.loseContext?.();};
 };
})();
