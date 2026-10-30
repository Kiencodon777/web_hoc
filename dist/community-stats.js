'use strict';
// counting.txt adaptation: a rounded numeric tween, with no React runtime.
(()=>{
 const format=n=>new Intl.NumberFormat('vi-VN').format(n),reduced=matchMedia('(prefers-reduced-motion: reduce)'),mobile=matchMedia('(max-width:800px)');
 let latest=null,busy=false,displayed=0,frame=0,target=null;
 function stop(){cancelAnimationFrame(frame);frame=0;}
 function paint(){
  document.querySelector('#community-band')?.remove();
  if(!latest)return;
  const host=document.querySelector(mobile.matches?'.mobile-brand':'.night-breadcrumb');
  if(!host)return;
  let badge=document.querySelector('#community-presence');
  if(!badge){
   badge=document.createElement('div');badge.id='community-presence';badge.className='community-presence';
   badge.innerHTML='<i class="community-presence-dot" aria-hidden="true"></i><strong class="community-presence-number" aria-hidden="true">0</strong><span class="community-presence-label" aria-hidden="true">đang online</span><span class="sr-only" role="status" aria-atomic="true"></span>';
   target=null;
  }
  if(badge.parentElement!==host)host.append(badge);
  badge.title=(latest.preview?'Số liệu của bản thử. ':'')+'Số trình duyệt có tương tác trong 2 phút gần nhất; không phải số người tuyệt đối.';
  const count=latest.online,node=badge.querySelector('strong');badge.dataset.active=String(count>0);
  if(target===count)return;
  stop();target=count;badge.querySelector('[role="status"]').textContent=format(count)+' trình duyệt đang hoạt động trong 2 phút gần nhất.';
  const from=displayed,start=performance.now();node.textContent=format(from);
  function tick(now){
   if(!node.isConnected){stop();return;}
   const t=document.hidden||reduced.matches||window.KienUI?.motionEnabled?.()===false?1:Math.min(1,(now-start)/700);
   const eased=t*t*(3-2*t);displayed=Math.round(from+(count-from)*eased);node.textContent=format(displayed);
   if(t<1)frame=requestAnimationFrame(tick);else frame=0;
  }
  tick(start);
 }
 function unavailable(){stop();latest=null;target=null;document.querySelector('#community-presence')?.remove();}
 async function refresh(){
  if(busy||document.hidden)return;busy=true;
  try{
   const r=await fetch('/api/community/stats',{credentials:'same-origin',cache:'no-store',signal:AbortSignal.timeout(10000)});
   if(!r.ok){unavailable();return;}
   const data=await r.json();if(!Number.isSafeInteger(data.online)||data.online<0){unavailable();return;}
   latest={online:data.online,preview:data.preview===true};paint();
  }catch{unavailable();}finally{busy=false;}
 }
 document.addEventListener('kien-page-view',()=>{if(latest)paint();else refresh();});
 mobile.addEventListener('change',()=>{if(latest)paint();});
 document.addEventListener('visibilitychange',()=>{if(document.hidden){stop();if(latest){displayed=latest.online;const n=document.querySelector('.community-presence-number');if(n)n.textContent=format(displayed);}}else refresh();});
 window.addEventListener('pagehide',stop);
 setInterval(refresh,30000);refresh();
})();
