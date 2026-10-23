'use strict';
/* Native web ports of the user's WorksWheel, Motiq Magnetic Dock (MIT),
   and Apple Hello's sequential SVG stroke drawing. */
(()=>{
 const P=window.KienPhysics,clamp=(v,a,b)=>Math.min(b,Math.max(a,v)),motion=()=>window.KienUI.motionEnabled();
 let wheelDispose=()=>{},helloDispose=()=>{},helloPlayed=false;
 const strokes=[
  ['M24 178C51 126 71 72 82 35C89 9 115 5 111 29C107 62 80 100 52 127L43 188',0,.9],
  ['M58 133C91 102 125 79 144 57C150 49 153 48 156 48',.55,.6],
  ['M94 108C88 142 97 184 121 188C144 192 160 169 174 137',.9,.6],
  ['M179 98C173 127 165 156 169 174C173 192 193 193 211 176L224 156',1.35,.55],
  ['M206 170C231 152 259 132 255 111C252 88 224 92 215 117C200 161 216 192 246 189C268 187 282 170 294 147',1.75,.75],
  ['M295 99L280 190',2.25,.3],
  ['M285 165C295 121 315 94 333 98C359 103 341 145 341 163C340 181 349 190 364 190C381 191 396 171 408 147',2.45,.85],
  ['M458 170C489 149 520 110 541 77C558 49 568 22 556 15C539 4 525 22 519 46C507 96 502 143 494 190',3.15,.8],
  ['M610 16C601 76 591 139 582 190',3.7,.45],
  ['M493 133C526 117 564 124 606 107',3.9,.4],
  ['M590 151C584 177 594 191 613 190C636 189 650 165 656 141',4.1,.45],
  ['M653 142C662 113 678 95 699 96C728 96 739 119 734 144C729 174 708 193 686 191C663 189 652 169 655 144C658 119 674 98 695 97C711 96 725 105 737 113C749 121 761 119 772 106',4.45,.8],
  ['M838 109C829 96 815 93 801 98C774 108 763 143 771 170C780 201 815 194 840 169C848 161 855 146 861 132C871 116 884 111 893 117',5.15,.65],
  ['M185 65L185 65.2',5.75,.15,'accent'],
  ['M227 75L248 58L265 76',5.85,.35,'accent'],
  ['M267 37L285 21',6.1,.25,'accent'],
  ['M692 226L692 226.2',6.35,.15,'accent']
 ];
 function wordmark(){return `<div class="hello-wordmark"><h1 class="sr-only">Kiến Học</h1><svg class="hello-signature" viewBox="0 0 915 250" fill="none" stroke="currentColor" stroke-width="14.8883" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${strokes.map(([d,start,duration,kind])=>`<path d="${d}" pathLength="1" stroke-dasharray="1" stroke-dashoffset="0" data-start="${start}" data-duration="${duration}" class="${kind||''}"/>`).join('')}</svg></div>`;}
 function mountHello(){
  helloDispose();helloDispose=()=>{};const root=document.querySelector('.hello-wordmark');if(!root||helloPlayed||!motion())return;helloPlayed=true;
  const animations=[...root.querySelectorAll('path')].map(path=>path.animate([{strokeDashoffset:1,opacity:0},{strokeDashoffset:0,opacity:1}],{duration:Number(path.dataset.duration)*1000,delay:Number(path.dataset.start)*1000,easing:'cubic-bezier(.45,0,.25,1)',fill:'both'}));
  let visible=true;const sync=()=>{if(!motion()){animations.forEach(a=>a.cancel());return;}for(const a of animations){if(a.playState==='finished'||a.playState==='idle')continue;if(document.hidden||!visible)a.pause();else if(a.playState==='paused')a.play();}};
  const io=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;sync();});io.observe(root);document.addEventListener('visibilitychange',sync);document.addEventListener('kien-motion-change',sync);
  helloDispose=()=>{io.disconnect();animations.forEach(a=>a.cancel());document.removeEventListener('visibilitychange',sync);document.removeEventListener('kien-motion-change',sync);};
 }
 function learningGlyph(kind){
  const paths={library:'<path d="m3 7 9-4 9 4-9 4-9-4Zm4 3v6c3 3 7 3 10 0v-6M21 7v8"/>',search:'<circle cx="10" cy="10" r="6"/><path d="m15 15 6 6"/>',play:'<path d="m8 5 11 7-11 7V5Z"/>',history:'<path d="M5 3h13v18H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Zm0 14h13M7 7h7M7 11h5"/>',information:'<path d="M3 13c2-10 4-10 6 0s4 10 6 0 4-10 6 0M3 21h18"/>',ai:'<rect x="6" y="6" width="12" height="12" rx="3"/><path d="M9 2v4M15 2v4M9 18v4M15 18v4M2 9h4M2 15h4M18 9h4M18 15h4m-9-11-3 5h4l-3 5"/>',wrong:'<path d="M19 7a8 8 0 1 0 1 9M19 3v5h-5M12 7v5l3 2"/>',saved:'<path d="M6 3h12v18l-6-4-6 4V3Z"/>',guide:'<path d="M4 3v18M4 7h12l-3 4 3 4H4M20 21H2"/>',theme:'<circle cx="12" cy="12" r="8"/><path d="m12 4 1 7 7 1M12 12l-6 6"/><circle cx="8" cy="8" r=".5"/>'};
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[kind]||paths.library}</svg>`;
 }
 function mountDock(root){
  const rows=[...root.querySelectorAll('.dock-item')].filter(e=>!e.closest('[hidden]')),icons=rows.map(e=>e.querySelector('.dock-icon'));
  rows.forEach((e,i)=>{const d=e.dataset,kind=e.hasAttribute('data-catalog-nav')?'library':e.hasAttribute('data-find-subject')?'search':e.id==='resume'?'play':d.course||d.view==='home'?'history':d.view||'theme';let name=kind;if(d.course)name=d.course;if(name==='bank')name='search';icons[i].innerHTML=learningGlyph(name);});
  const states=icons.map(()=>({scale:{x:1,v:0},lift:{x:0,v:0},drift:{x:0,v:0}}));let bases=[],raf=0,last=0,phase=2.8,visible=true,disposed=false,pointer=null,focus=-1,box={width:0,height:0};
  const base=(el)=>{let x=el.offsetWidth/2,y=el.offsetHeight/2,node=el;while(node&&node!==root){x+=node.offsetLeft;y+=node.offsetTop;node=node.offsetParent;}return{x,y};};
  const measure=()=>{bases=icons.map(base);box={width:root.clientWidth,height:root.clientHeight};};
  const allowed=()=>!disposed&&motion()&&!document.hidden&&visible&&!root.inert&&!document.body.classList.contains('dock-hidden');
  const reset=()=>{cancelAnimationFrame(raf);raf=0;icons.forEach((el,i)=>{el.style.transform='';states[i]={scale:{x:1,v:0},lift:{x:0,v:0},drift:{x:0,v:0}};});};
  function frame(now){raf=0;if(!allowed()){reset();return;}const dt=clamp((now-last)/1000||.016,.001,.04);last=now;phase+=dt;
   const first=bases[0]?.y||80,lastY=bases[bases.length-1]?.y||box.height-80;
   const point=pointer||((focus>=0&&bases[focus])?{...bases[focus],y:bases[focus].y-root.scrollTop}:null);
   const py=point?point.y:((first+lastY)/2+Math.sin(phase*.55)*(lastY-first)*.42-root.scrollTop),px=point?point.x:(bases[0]?.x||40),amp=point?1:.42;
   icons.forEach((el,i)=>{const b=bases[i],s=states[i];if(!b)return;const d=py-(b.y-root.scrollTop),reach=Math.max(0,1-Math.abs(px-b.x)/220),inf=P.gaussian(d,86)*amp*reach;
    s.scale=P.step(s.scale.x,s.scale.v,1+.5*inf,dt,{mass:1,stiffness:420,damping:26});s.lift=P.step(s.lift.x,s.lift.v,12*inf,dt,{mass:1,stiffness:360,damping:22});s.drift=P.step(s.drift.x,s.drift.v,d*.13*inf,dt,{mass:1,stiffness:300,damping:20});
    el.style.transform=`translate3d(${s.lift.x.toFixed(2)}px,${s.drift.x.toFixed(2)}px,0) scale(${s.scale.x.toFixed(3)})`;
   });raf=requestAnimationFrame(frame);
  }
  const sync=()=>{if(!allowed())reset();else if(!raf){last=performance.now();raf=requestAnimationFrame(frame);}};
  const track=e=>{if(e.pointerType&&e.pointerType!=='mouse')return;const r=root.getBoundingClientRect();pointer={x:e.clientX-r.left,y:e.clientY-r.top};focus=-1;sync();};
  const leave=()=>{pointer=null;sync();},focusin=e=>{const i=rows.indexOf(e.target.closest('.dock-item'));if(i>=0&&e.target.matches(':focus-visible')){focus=i;pointer=null;sync();}},focusout=()=>{focus=-1;sync();};
  root.addEventListener('pointermove',track,{passive:true});root.addEventListener('pointerleave',leave);root.addEventListener('pointercancel',leave);root.addEventListener('focusin',focusin);root.addEventListener('focusout',focusout);root.addEventListener('scroll',measure,{passive:true});
  const ro=new ResizeObserver(()=>{measure();sync();});ro.observe(root);const io=new IntersectionObserver(([e])=>{visible=e.isIntersecting;sync();});io.observe(root);const mo=new MutationObserver(sync);mo.observe(document.body,{attributes:true,attributeFilter:['class']});mo.observe(root,{attributes:true,attributeFilter:['inert']});document.addEventListener('visibilitychange',sync);document.addEventListener('kien-motion-change',sync);measure();sync();
  return()=>{disposed=true;reset();ro.disconnect();io.disconnect();mo.disconnect();root.removeEventListener('pointermove',track);root.removeEventListener('pointerleave',leave);root.removeEventListener('pointercancel',leave);root.removeEventListener('focusin',focusin);root.removeEventListener('focusout',focusout);root.removeEventListener('scroll',measure);document.removeEventListener('visibilitychange',sync);document.removeEventListener('kien-motion-change',sync);};
 }
 function cover(s){return `<span class="wheel-cover cover-${s.id}"><span class="wheel-cover-top">KIẾN HỌC / ${s.code}<span>0${SUBJECTS.indexOf(s)+1}</span></span><span class="wheel-cover-icon">${learningGlyph(s.id)}</span><strong>${s.title}</strong><small>${s.count}</small><span class="wheel-cover-action">Mở môn ↗</span></span>`;}
 function wheelMarkup(){return `<section class="works-wheel" aria-label="Vòng khám phá môn học"><div class="works-stage" tabindex="0" role="listbox" aria-label="Chọn môn: cuộn, kéo hoặc dùng phím mũi tên" aria-activedescendant="wheel-subject-0"><div class="works-drum">${SUBJECTS.map((s,i)=>`<button type="button" id="wheel-subject-${i}" class="works-card" role="option" aria-selected="${i===0}" aria-label="Mở môn ${s.title}" data-wheel-card="${i}" tabindex="-1"><span class="works-face">${cover(s)}</span></button>`).join('')}</div></div><div class="works-ring-label" aria-hidden="true"><span>CHỌN ĐIỀU BẠN MUỐN HIỂU</span><b>Mở một<br>chân trời.</b></div><div class="works-front-title" aria-hidden="true"></div><ol class="works-index">${SUBJECTS.map((s,i)=>`<li><button data-wheel-to="${i+1}" aria-label="Xem thẻ ${s.title}"><span>0${i+1}</span>${s.code}</button></li>`).join('')}</ol><div class="works-toolbar"><button data-wheel-ring aria-label="Xem vòng thẻ">◯</button><span class="works-help">Cuộn hoặc kéo để khám phá</span><button data-wheel-prev aria-label="Môn trước">↑</button><button data-wheel-next aria-label="Môn tiếp theo">↓</button></div><div class="works-readout"><span><b class="works-current-name"></b><small class="works-current-count"></small></span><button class="btn" data-wheel-open data-course="history">Mở môn ↗</button></div><p class="works-announcement sr-only" role="status" aria-live="polite"></p></section>`;}
 function mountWheel(){
  wheelDispose();wheelDispose=()=>{};const root=document.querySelector('.works-wheel');if(!root)return;const stage=root.querySelector('.works-stage'),drum=root.querySelector('.works-drum'),cards=[...root.querySelectorAll('.works-card')],ringLabel=root.querySelector('.works-ring-label'),title=root.querySelector('.works-front-title');
  let turn=0,target=0,raf=0,lastTime=0,metrics=null,active=-1,settle=0,drag=null,suppressClick=false,visible=true,disposed=false;
  function updateActive(index){if(active===index)return;active=index;const s=SUBJECTS[index];title.textContent=s.title;root.querySelector('.works-current-name').textContent=s.title;root.querySelector('.works-current-count').textContent=s.count;root.querySelector('[data-wheel-open]').dataset.course=s.id;stage.setAttribute('aria-activedescendant','wheel-subject-'+index);cards.forEach((c,i)=>c.setAttribute('aria-selected',String(i===index)));root.querySelectorAll('[data-wheel-to]').forEach((b,i)=>b.setAttribute('aria-current',i===index?'true':'false'));root.querySelector('.works-announcement').textContent=s.title+' · '+s.count;}
  function draw(){if(!metrics)return;const m=clamp(turn,0,1),pos=Math.max(0,turn-1);root.dataset.wheelState=m<.5?'ring':'drum';drum.style.transform=`translateZ(${-m*metrics.drumR}px)`;
   cards.forEach((c,i)=>{const d=i-pos,hidden=m>.5&&Math.abs(d)>1.6;c.style.transform=P.wheelPlace(d*360/cards.length,d*40,metrics.ringR,metrics.drumR,metrics.bow,m);c.style.opacity=hidden?'0':'1';c.style.visibility=hidden?'hidden':'visible';c.inert=hidden;c.style.zIndex=String(Math.round(100-Math.abs(d)*2));c.firstElementChild.style.transform=`scale(${metrics.ringScale+(1-metrics.ringScale)*m})`;});ringLabel.style.opacity=String(1-m);title.style.opacity=String(m);updateActive(clamp(Math.round(pos),0,SUBJECTS.length-1));
  }
  function frame(now){raf=0;if(disposed||document.hidden||!visible)return;const dt=Math.min(.05,(now-lastTime)/1000||1/60);lastTime=now;const gap=target-turn;if(Math.abs(gap)<.0005||!motion())turn=target;else turn+=gap*(1-Math.pow(1-.12,dt*60));draw();if(turn!==target)raf=requestAnimationFrame(frame);}
  const wake=()=>{if(!raf&&!disposed&&!document.hidden&&visible){lastTime=performance.now();raf=requestAnimationFrame(frame);}};
  const to=next=>{target=clamp(next,0,SUBJECTS.length);wake();};
  const measure=()=>{metrics=P.wheelMetrics(stage.clientWidth,stage.clientHeight,cards.length);stage.style.perspective=metrics.depth+'px';cards.forEach(c=>Object.assign(c.style,{width:metrics.cardW+'px',height:metrics.cardH+'px',marginLeft:-metrics.cardW/2+'px',marginTop:-metrics.cardH/2+'px'}));draw();};
  const wheel=e=>{const units=e.deltaMode===1?e.deltaY*16:e.deltaMode===2?e.deltaY*stage.clientHeight:e.deltaY,next=target+units/900;if(next>0&&next<SUBJECTS.length)e.preventDefault();to(next);clearTimeout(settle);settle=setTimeout(()=>to(Math.round(target)),140);};
  const down=e=>{if(e.button!==0)return;drag={id:e.pointerId,y:e.clientY,start:e.clientY};suppressClick=false;};
  const move=e=>{if(!drag||e.pointerId!==drag.id)return;if(!e.buttons){up();return;}if(Math.abs(e.clientY-drag.start)>6){suppressClick=true;if(!stage.hasPointerCapture(e.pointerId))stage.setPointerCapture(e.pointerId);}to(target+(drag.y-e.clientY)/420);drag.y=e.clientY;};
  const up=()=>{if(!drag)return;const id=drag.id;if(stage.hasPointerCapture(id))stage.releasePointerCapture(id);drag=null;to(Math.round(target));};
  const open=id=>{openSubject(id);window.scrollTo(0,0);};
  const click=e=>{const b=e.target.closest('button');if(!b)return;if(b.dataset.wheelCard!==undefined){if(suppressClick){suppressClick=false;return;}open(SUBJECTS[Number(b.dataset.wheelCard)].id);}else if(b.dataset.wheelTo)to(Number(b.dataset.wheelTo));else if(b.hasAttribute('data-wheel-ring'))to(0);else if(b.hasAttribute('data-wheel-prev'))to(Math.round(target)-1);else if(b.hasAttribute('data-wheel-next'))to(Math.round(target)+1);};
  const key=e=>{if(e.target!==stage)return;if(e.key==='ArrowDown'||e.key==='ArrowRight')to(Math.round(target)+1);else if(e.key==='ArrowUp'||e.key==='ArrowLeft')to(Math.round(target)-1);else if(e.key==='Home')to(0);else if(e.key==='End')to(SUBJECTS.length);else if(e.key==='Enter'||e.key===' ')open(SUBJECTS[active].id);else return;e.preventDefault();};
  const sync=()=>{if(document.hidden||!visible){cancelAnimationFrame(raf);raf=0;}else{if(!motion()){turn=target;draw();}wake();}};
  stage.addEventListener('wheel',wheel,{passive:false});stage.addEventListener('pointerdown',down);stage.addEventListener('pointermove',move);stage.addEventListener('pointerup',up);stage.addEventListener('pointercancel',up);window.addEventListener('pointerup',up);stage.addEventListener('keydown',key);root.addEventListener('click',click);const ro=new ResizeObserver(measure);ro.observe(stage);const io=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;sync();});io.observe(stage);document.addEventListener('visibilitychange',sync);document.addEventListener('kien-motion-change',sync);measure();
  wheelDispose=()=>{disposed=true;cancelAnimationFrame(raf);clearTimeout(settle);ro.disconnect();io.disconnect();stage.removeEventListener('wheel',wheel);stage.removeEventListener('pointerdown',down);stage.removeEventListener('pointermove',move);stage.removeEventListener('pointerup',up);stage.removeEventListener('pointercancel',up);window.removeEventListener('pointerup',up);stage.removeEventListener('keydown',key);root.removeEventListener('click',click);document.removeEventListener('visibilitychange',sync);document.removeEventListener('kien-motion-change',sync);};
 }
 window.KienV9={wordmark,wheelMarkup,mountDock,afterRender(){mountHello();mountWheel();}};
})();
