'use strict';
/* Web adaptation of the supplied Liquid Glass kit, Apple Dock and Tilted Grid.
   Keeps the existing data, quiz handlers and progress store intact. */
(()=>{
 const P=window.KienPhysics,enabled=()=>window.KienUI.motionEnabled();
 let prefs;try{prefs=JSON.parse(localStorage.getItem('kienhoc-layout-v1'))||{};}catch{prefs={};}
 let springDispose=()=>{},reelDispose=()=>{},recolorReel=()=>{},indicatorDispose=()=>{},answerDispose=()=>{},reveal,lastIndicatorY=null;
 const save=()=>{try{localStorage.setItem('kienhoc-layout-v1',JSON.stringify(prefs));}catch{}};
 const chevron='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="m9 5 7 7-7 7"/></svg>';
 function layout(){
  const hidden=!!prefs.dockHidden,aside=document.querySelector('.sidebar');
  document.body.classList.toggle('dock-hidden',hidden);aside.inert=innerWidth<=800?!document.body.classList.contains('dock-open'):hidden;
  reveal.setAttribute('aria-expanded',String(!hidden));reveal.hidden=!hidden;
 }
 function ensure(){
  if(reveal)return;
  reveal=document.createElement('button');reveal.className='dock-reveal';reveal.dataset.dockToggle='';reveal.setAttribute('aria-controls','learning-dock');reveal.setAttribute('aria-label','Hiện thanh mục lục');reveal.innerHTML=chevron+'<span>Mục lục</span>';document.body.append(reveal);
 }
 function journey(){
  const panel=document.querySelector('.quizaside');if(!panel)return;
  const title=panel.querySelector('h3');title.id='journey-title';
  const head=document.createElement('div');head.className='journey-heading';title.replaceWith(head);head.append(title);
  const btn=document.createElement('button');btn.className='journey-toggle';btn.dataset.journeyToggle='';btn.setAttribute('aria-controls','journey-content');btn.innerHTML=chevron;head.append(btn);
  const content=document.createElement('div');content.id='journey-content';while(head.nextSibling)content.append(head.nextSibling);panel.append(content);
  const mini=document.createElement('span');mini.className='journey-mini';mini.textContent=`${Object.keys(session?.answers||{}).length}/${session?.keys.length||0} đã chọn`;head.append(mini);
  setJourney(!!prefs.journeyCollapsed);
 }
 function setJourney(collapsed){
  const panel=document.querySelector('.quizaside');if(!panel)return;
  panel.classList.toggle('journey-collapsed',collapsed);document.querySelector('.quizlayout').classList.toggle('journey-compact',collapsed);
  panel.querySelector('#journey-content').hidden=collapsed;
  const b=panel.querySelector('[data-journey-toggle]');b.setAttribute('aria-expanded',String(!collapsed));b.setAttribute('aria-label',collapsed?'Mở hành trình lượt này':'Thu gọn hành trình lượt này');
 }
 /* Same distance interpolation + mass/stiffness/damping as Framer source.
    Icons magnify toward the content; answer labels stay within their row. */
 function springGroup(root,selector,kind){
  const items=[...root.querySelectorAll(selector)].filter(x=>x.offsetHeight>0),states=items.map(()=>({x:0,v:0,target:0}));
  let raf=0,last=0,pointer=null,focus=null,disposed=false;
  const apply=(el,f)=>{el.style.setProperty('--dock-force',f.toFixed(4));el.style.setProperty('--dock-scale',(1+.6*f).toFixed(4));el.style.setProperty('--answer-scale',(1+.018*f).toFixed(4));};
  function targets(){const index=focus?items.indexOf(focus):-1;items.forEach((el,i)=>{const r=el.getBoundingClientRect(),center=r.top+r.height/2;states[i].target=!enabled()?0:pointer!==null?P.influence(pointer-center,kind==='dock'?118:130):index>=0?P.influence((i-index)*70,130):0;});}
  function frame(now){raf=0;if(disposed)return;const dt=Math.min((now-last)/1000||1/60,.04);last=now;let busy=false;
   items.forEach((el,i)=>{const s=states[i],next=P.step(s.x,s.v,s.target,dt);Object.assign(s,next);if(Math.abs(s.target-s.x)<.0005&&Math.abs(s.v)<.003){s.x=s.target;s.v=0;}else busy=true;apply(el,Math.max(0,s.x));});
   if(busy)raf=requestAnimationFrame(frame);
  }
  const wake=()=>{targets();if(!enabled()){items.forEach(el=>apply(el,0));return;}if(!raf){last=performance.now();raf=requestAnimationFrame(frame);}};
  const move=e=>{if(e.pointerType&&e.pointerType!=='mouse')return;pointer=e.clientY;focus=null;wake();};
  const leave=()=>{pointer=null;wake();};
  const focusin=e=>{const t=e.target.closest(selector);if(t?.matches(':focus-visible')){focus=t;pointer=null;wake();}};
  const focusout=()=>{focus=null;wake();};
  root.addEventListener('pointermove',move,{passive:true});root.addEventListener('pointerleave',leave);root.addEventListener('focusin',focusin);root.addEventListener('focusout',focusout);
  const clear=()=>{pointer=focus=null;states.forEach(s=>{s.x=s.v=s.target=0;});cancelAnimationFrame(raf);raf=0;items.forEach(el=>apply(el,0));};
  document.addEventListener('visibilitychange',clear);document.addEventListener('kien-motion-change',clear);
  return()=>{disposed=true;clear();root.removeEventListener('pointermove',move);root.removeEventListener('pointerleave',leave);root.removeEventListener('focusin',focusin);root.removeEventListener('focusout',focusout);document.removeEventListener('visibilitychange',clear);document.removeEventListener('kien-motion-change',clear);};
 }
 function indicator(){
  const nav=document.querySelector('.sidebar nav'),pill=nav.querySelector('.dock-indicator'),active=nav.querySelector('.active');if(!active)return()=>{};
  let raf=0,last=0,y=0,v=0,to=0,h=0,first=true;
  const measure=()=>{to=active.getBoundingClientRect().top-nav.getBoundingClientRect().top+nav.scrollTop;h=active.offsetHeight;pill.style.height=h+'px';if(first){y=lastIndicatorY??to;first=false;}if(!raf){last=performance.now();raf=requestAnimationFrame(frame);}};
  function frame(now){raf=0;const next=enabled()?P.step(y,v,to,Math.min((now-last)/1000,.04),{mass:1,stiffness:320,damping:24}):{x:to,v:0};last=now;y=next.x;lastIndicatorY=y;v=next.v;const lag=Math.min(1,Math.abs(to-y)/64);pill.style.transform=`translateY(${y}px) scale(${1-lag*.08},${1+lag*.16})`;pill.style.opacity='1';if(Math.abs(to-y)>.05||Math.abs(v)>.05)raf=requestAnimationFrame(frame);}
  const ro=new ResizeObserver(measure);ro.observe(nav);measure();return()=>{cancelAnimationFrame(raf);ro.disconnect();};
 }
 function wrapWords(text,max){const lines=[''];for(const word of text.split(' ')){if((lines[lines.length-1]+' '+word).trim().length>max)lines.push(word);else lines[lines.length-1]=(lines[lines.length-1]+' '+word).trim();}return lines;}
 const xml=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[c]));
 function artwork(s){
  const colors=s.id==='history'?['#65444f','#e8b7c8']:s.id==='information'?['#294e50','#b1e5d9']:['#54416e','#d7bef4'];
  const title=wrapWords(s.title,25),desc=wrapWords(s.desc,39),symbol=academyIcon(s.id==='history'?'book':s.id==='ai'?'spark':'layers').replace('<svg ','<svg x="38" y="83" width="80" height="80" ').replace('currentColor',colors[1]);
  const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="560" height="500" viewBox="0 0 560 500"><defs><linearGradient id="g" x2="1" y2="1"><stop stop-color="${colors[0]}"/><stop offset="1" stop-color="#13151f"/></linearGradient></defs><rect x="1" y="1" width="558" height="498" rx="28" fill="#1d1d29" stroke="#6c6276"/><path d="M29 1H531Q559 1 559 29V207H1V29Q1 1 29 1" fill="url(#g)"/><path d="M1 207H559" stroke="#ffffff22"/><g font-family="'Be Vietnam Pro',sans-serif" fill="#f6effc"><text x="35" y="43" fill="${colors[1]}" font-size="12" letter-spacing="2">KIẾN HỌC / ${s.code}</text>${symbol}<text x="140" y="145" font-size="64" font-weight="600" fill="${colors[1]}">${s.code}</text><text x="35" y="244" font-size="12" letter-spacing="2" fill="${colors[1]}">${xml(s.category.toUpperCase())}</text>${title.map((t,i)=>`<text x="35" y="${282+i*35}" font-size="27" font-weight="600">${xml(t)}</text>`).join('')}${desc.map((t,i)=>`<text x="35" y="${(title.length>1?366:338)+i*25}" font-size="17" fill="#c4bdcf">${xml(t)}</text>`).join('')}<path d="M35 427H525" stroke="#ffffff22"/><text x="35" y="466" font-size="17">${xml(s.count)}</text><circle cx="501" cy="460" r="23" fill="#ffffff0b" stroke="#ffffff44"/><path d="M491 460h20m-8-8 8 8-8 8" stroke="${colors[1]}" fill="none" stroke-width="2"/></g></svg>`;
  const style=getComputedStyle(document.body),ink=style.getPropertyValue('--ui-text').trim()||'#f6effc',muted=style.getPropertyValue('--ui-muted').trim()||'#c4bdcf';
  const themed=svg.replace(/<text\b([^>]*)>/g,(_,attrs)=>'<text'+attrs.replace(/\sfill="[^"]*"/g,'')+' fill="'+(attrs.includes('font-size="17"')?muted:ink)+'">');
  return 'data:image/svg+xml;charset=utf-8,'+encodeURIComponent(themed);
 }
 function refreshCourses(){
  reelDispose();reelDispose=()=>{};const root=document.querySelector('#course-results');if(!root)return;
  const grid=root.querySelector('.course-grid'),ids=grid?[...grid.querySelectorAll('[data-course]')].map(x=>x.dataset.course):[],subjects=ids.map(id=>SUBJECTS.find(s=>s.id===id));if(subjects.length<2)return;
  const reel=document.createElement('section');reel.className='course-reel';reel.setAttribute('aria-label','Dòng thẻ môn học cong');reel.innerHTML='<div class="reel-topline"><span>CHỌN MỘT HÀNH TRÌNH</span><div><button class="reel-control" data-reel-prev aria-label="Thẻ môn trước">‹</button><button class="reel-control" data-reel-pause aria-label="Tạm dừng dòng thẻ" aria-pressed="false">Ⅱ</button><button class="reel-control" data-reel-next aria-label="Thẻ môn tiếp theo">›</button><button class="reel-grid-toggle" data-reel-grid aria-pressed="false">Xem dạng lưới</button></div></div><div class="reel-viewport"><div class="reel-band reel-mesh"><canvas aria-hidden="true"></canvas></div></div><p class="reel-caption">Lướt theo đường cong. Dừng ở môn bạn muốn học.</p>';grid.before(reel);root.classList.add('reel-ready');
  const viewport=reel.querySelector('.reel-viewport'),band=reel.querySelector('.reel-band'),canvas=band.querySelector('canvas'),buttons=[];
  let renderer=null,manualPaused=false,hovered=false,focused=false,visible=true,isGrid=false,fallback=false;
  const paintMode=()=>{const showGrid=isGrid||fallback;root.classList.toggle('show-course-grid',showGrid);grid.inert=!showGrid;grid.setAttribute('aria-hidden',String(!showGrid));viewport.hidden=showGrid;reel.querySelector('.reel-caption').hidden=showGrid;const toggle=reel.querySelector('[data-reel-grid]');toggle.textContent=fallback?'Đang xem dạng lưới':isGrid?'Xem dòng thẻ':'Xem dạng lưới';toggle.disabled=fallback;toggle.setAttribute('aria-pressed',String(showGrid));};
  const sync=()=>{const paused=manualPaused||hovered||focused||!visible||document.hidden||!enabled()||isGrid||fallback;reel.classList.toggle('reel-paused',paused);renderer?.pause(paused);const b=reel.querySelector('[data-reel-pause]');b.textContent=manualPaused?'▶':'Ⅱ';b.setAttribute('aria-label',manualPaused?'Chạy dòng thẻ':'Tạm dừng dòng thẻ');b.setAttribute('aria-pressed',String(manualPaused));};
  const onCards=cards=>{while(buttons.length<cards.length){const button=document.createElement('button');button.className='reel-tile';band.append(button);buttons.push(button);}buttons.forEach((button,i)=>{const card=cards[i];button.hidden=!card?.visible;if(!card)return;const subject=subjects[card.index];button.dataset.course=subject.id;button.setAttribute('aria-label','Mở môn '+subject.title);button.style.transform='translate3d('+card.left+'px,'+card.top+'px,0)';button.style.width=card.width+'px';button.style.height=card.height+'px';});};
  renderer=window.KienReel.mount(viewport,canvas,subjects.map(artwork),onCards,value=>{fallback=value;paintMode();sync();});
  paintMode();sync();
  recolorReel=()=>renderer.setAssets(subjects.map(artwork));
  const io=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;sync();});io.observe(viewport);
  const enter=e=>{if(e.pointerType==='touch')return;hovered=true;sync();},leave=()=>{hovered=false;sync();},focusin=()=>{focused=true;sync();},focusout=e=>{if(!reel.contains(e.relatedTarget)){focused=false;sync();}};
  band.addEventListener('pointerenter',enter);band.addEventListener('pointerleave',leave);reel.addEventListener('focusin',focusin);reel.addEventListener('focusout',focusout);
  reel.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;if(b.hasAttribute('data-reel-pause')){manualPaused=!manualPaused;sync();}else if(b.hasAttribute('data-reel-prev')||b.hasAttribute('data-reel-next'))renderer.step(b.hasAttribute('data-reel-next')?1:-1);else if(b.hasAttribute('data-reel-grid')){isGrid=!isGrid;paintMode();sync();}});
  document.addEventListener('visibilitychange',sync);document.addEventListener('kien-motion-change',sync);
  reelDispose=()=>{recolorReel=()=>{};renderer.destroy();io.disconnect();document.removeEventListener('visibilitychange',sync);document.removeEventListener('kien-motion-change',sync);reel.remove();root.classList.remove('reel-ready','show-course-grid');grid.inert=false;grid.removeAttribute('aria-hidden');};
 }
 function refreshAnswers(){answerDispose();const ds=[...document.querySelectorAll('.options')].map(root=>springGroup(root,'.option','answer'));answerDispose=()=>ds.forEach(d=>d());}
 function afterRender(){ensure();layout();journey();springDispose();indicatorDispose();springDispose=window.KienV9.mountDock(document.querySelector('.sidebar'));refreshAnswers();indicatorDispose=indicator();refreshCourses();window.KienV9.afterRender();}
 document.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;if(b.hasAttribute('data-dock-toggle')){const hiding=!(innerWidth<=800?false:prefs.dockHidden);if(innerWidth<=800){document.body.classList.remove('dock-open');document.querySelector('[data-menu-toggle]').setAttribute('aria-expanded','false');prefs.dockHidden=true;}else prefs.dockHidden=hiding;save();layout();if(prefs.dockHidden)(innerWidth<=800?document.querySelector('[data-menu-toggle]'):reveal).focus();else document.querySelector('.dock-hide').focus();}else if(b.hasAttribute('data-journey-toggle')){prefs.journeyCollapsed=!prefs.journeyCollapsed;save();setJourney(prefs.journeyCollapsed);}else if(b.hasAttribute('data-menu-toggle')){prefs.dockHidden=false;layout();}else if(b.hasAttribute('data-close-dock'))layout();},true);
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&reveal)layout();});
 window.addEventListener('resize',()=>{if(reveal)layout();});
 window.KienPolish={afterRender,refreshCourses,refreshAnswers,recolorCourses(){recolorReel();},motionChanged(){document.dispatchEvent(new Event('kien-motion-change'));}};
})();
