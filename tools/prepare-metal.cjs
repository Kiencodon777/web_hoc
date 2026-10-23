const fs=require('fs'),path=require('path');
let code=fs.readFileSync(path.join(__dirname,'../design-references/liquid-metal-button.txt'),'utf8').replace(/\r/g,'').split('<script>')[1].split('</script>')[0];
code=code.replace("const cv = document.getElementById('fx');",'');
code=code.replace("const stage = document.getElementById('stage');",'');
code=code.replace("const btn   = document.getElementById('btn');",'let btn=initialBtn;');
code=code.replace("const plate = document.querySelector('.plate');",'');
code=code.replaceAll("powerPreference:'high-performance'","powerPreference:'low-power'");
code=code.replace(/window\.__[A-Z]\s*=\s*/g,'');
code=code.replace("document.body.innerHTML = '<p style=\"color:#888;font:14px system-ui\">WebGL2 is required for this page.</p>';","let target=initialBtn;const hide=()=>target?.classList.remove(\'metal-css-active\');const show=t=>{hide();target=t;target?.classList.add(\'metal-css-active\');};return {bind:show,focus:show,press:show,leave:hide,blur:hide,release(){},destroy:hide};");
code=code.replace('new ResizeObserver(() => { needResize = true; }).observe(stage);','const resizeObserver=new ResizeObserver(()=>{needResize=true;wake();});resizeObserver.observe(stage);');
code=code.replace("let drawn = null;",'let raf=0,disposed=false,lastDraw=0;\nlet drawn = null;');
code=code.replace('function frame(now){',"function frame(now){\n  raf=0;if(disposed||document.hidden||!btn?.isConnected)return;\n  if(now-lastDraw<32){raf=requestAnimationFrame(frame);return;}lastDraw=now;");
code=code.replace('if(!calm.matches) clock += dt;','if(moving()) clock += dt;');
code=code.replace('const sig = (calm.matches && !ripLive && ptrAmt < 0.002)','const sig = (!moving() && !ripLive && ptrAmt < 0.002)');
code=code.replace('if(sig !== null && sig === drawn){ requestAnimationFrame(frame); return; }','if(sig !== null && sig === drawn) return;');
code=code.replace('  requestAnimationFrame(frame);\n}\n\n/* ---------------- interaction',"  if(moving()&&(on.over||on.focus||on.press||hover>0.002||ripLive))raf=requestAnimationFrame(frame);\n  else if(hover<0.002)stage.style.opacity='0';\n}\n\n/* ---------------- interaction");
const cut=code.indexOf('/* ---------------- interaction');
code=code.slice(0,cut)+`
const on={over:false,press:false,focus:false};
const moving=()=>!calm.matches&&(window.KienUI?.motionEnabled?.()??true);
function position(){if(!btn?.isConnected)return;const b=btn.getBoundingClientRect();const pad=0;stage.style.borderRadius=getComputedStyle(btn).borderRadius;Object.assign(stage.style,{left:(b.left-pad)+'px',top:(b.top-pad)+'px',width:(b.width+pad*2)+'px',height:(b.height+pad*2)+'px'});needResize=true;}
function wake(){drawn=null;last=performance.now();if(!raf&&!disposed&&!document.hidden)raf=requestAnimationFrame(frame);}
function stop(){cancelAnimationFrame(raf);raf=0;hover=hoverTarget=press=pressTarget=ptrAmt=0;for(const r of RIP)r.on=0;stage.style.opacity='0';gl.bindFramebuffer(gl.FRAMEBUFFER,null);gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT);btn?.classList.remove('metal-lit','metal-pressed');}\nfunction sync(){if(!on.over&&!on.press&&!on.focus){stop();return;}hoverTarget=(on.over||on.press||on.focus)?1:0;pressTarget=on.press?1:0;btn?.classList.toggle('metal-lit',hoverTarget>.5);btn?.classList.toggle('metal-pressed',on.press);stage.style.opacity='1';wake();}
function setTarget(next){if(next===btn){position();return;}btn?.classList.remove('metal-lit','metal-pressed');btn=next;on.press=false;on.over=false;on.focus=false;hover=0;ptrAmt=0;ptrSpeed=0;for(const r of RIP)r.on=0;position();}
const pointer=e=>{if((on.over||on.press)&&btn?.isConnected)[ptr.x,ptr.y]=localPt(e);};
const release=()=>{on.press=false;sync();};
const hidden=()=>{on.over=on.press=on.focus=false;stop();};
const scroll=()=>{on.over=false;on.press=false;stop();};
window.addEventListener('pointermove',pointer,{passive:true});window.addEventListener('pointerup',release);window.addEventListener('pointercancel',release);window.addEventListener('scroll',scroll,{passive:true});window.addEventListener('resize',scroll);document.addEventListener('visibilitychange',hidden);
position();resize();
return {
 bind(target){setTarget(target);on.focus=false;on.over=true;sync();},leave(){on.over=false;on.press=false;sync();},focus(target){setTarget(target);on.focus=true;sync();},blur(){on.focus=false;sync();},press(target,e){setTarget(target);on.press=true;if(e&&'clientX'in e)[ptr.x,ptr.y]=localPt(e);if(moving())addRipple(ptr.x,ptr.y);sync();},release,
 destroy(){disposed=true;cancelAnimationFrame(raf);resizeObserver.disconnect();window.removeEventListener('pointermove',pointer);window.removeEventListener('pointerup',release);window.removeEventListener('pointercancel',release);window.removeEventListener('scroll',scroll);window.removeEventListener('resize',scroll);document.removeEventListener('visibilitychange',hidden);btn?.classList.remove('metal-lit','metal-pressed');for(const t of [T_core,T_rim,T_s1,T_s2,T_a,T_b]){gl.deleteTexture(t.tex);gl.deleteFramebuffer(t.fbo);}for(const p of [pScene,pRim,pDown,pBlur,pComp]){for(const s of gl.getAttachedShaders(p.p)||[])gl.deleteShader(s);gl.deleteProgram(p.p);}gl.deleteBuffer(vbo);gl.deleteVertexArray(vao);stage.style.opacity='0';}
};
}
`;
code=code.replace('if(!gl){',"stage.dataset.renderer=gl?'webgl2':'css';\nif(!gl){");
process.stdout.write(JSON.stringify({'dist/liquid-metal.js':'/* Adapted from the supplied Liquid Metal Button. One shared renderer for primary controls. */\nwindow.KienMetal={mount(stage,initialBtn,cv){\n'+code+'\n}};'}));
