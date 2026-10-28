'use strict';
// First-party counters: no raw URLs, IP addresses, email, answers or error text.
(()=>{
 if(navigator.globalPrivacyControl||navigator.doNotTrack==='1')return;
 let visitor,visit;try{visitor=localStorage.getItem('kienhoc-visitor-v1')||crypto.randomUUID();localStorage.setItem('kienhoc-visitor-v1',visitor);visit=sessionStorage.getItem('kienhoc-visit-v1')||crypto.randomUUID();sessionStorage.setItem('kienhoc-visit-v1',visit);}catch{return;}
 let enabled=true,view='catalog',subject='none',lastInput=Date.now(),lastError=0,pageSeen=false;
 const ua=navigator.userAgent,browser=/Edg\//.test(ua)?'Edge':/Firefox\//.test(ua)?'Firefox':/Chrome\//.test(ua)?'Chrome':/Safari\//.test(ua)?'Safari':'Other';
 const device=/iPad|Tablet/.test(ua)?'tablet':/Mobi|iPhone|Android/.test(ua)?'mobile':'desktop';
 async function send(kind,extra={}){if(!enabled||document.hidden||!navigator.onLine||!window.KienCloud)return;try{await window.KienCloud.api('/telemetry',{visitor,visit,kind,view,subject,scene:document.body.dataset.scene||'still',device,browser,...extra},!!window.KienCloud.getUser());}catch(error){if(error.status===404||error.status===503)enabled=false;}}
 document.addEventListener('kien-page-view',e=>{pageSeen=true;view=e.detail.view;subject=['history','information','ai'].includes(e.detail.subject)&&view!=='catalog'?e.detail.subject:'none';lastInput=Date.now();send('page_view');});
 ['pointerdown','keydown','scroll'].forEach(type=>document.addEventListener(type,()=>{lastInput=Date.now();},{passive:true}));
 document.addEventListener('visibilitychange',()=>{if(!document.hidden){lastInput=Date.now();send('heartbeat');}});
 document.addEventListener('kien-auth-change',()=>send('heartbeat'));
 setInterval(()=>{if(Date.now()-lastInput<120000)send('heartbeat');},30000);
 const error=e=>{if(Date.now()-lastError>30000){lastError=Date.now();send('js_error',{errorType:e.type==='unhandledrejection'?'UnhandledRejection':e.error?.name});}};window.addEventListener('error',error);window.addEventListener('unhandledrejection',error);
 try{new PerformanceObserver(list=>{const entry=list.getEntries().at(-1);if(entry)send('metric',{label:'LCP',value:entry.startTime});}).observe({type:'largest-contentful-paint',buffered:true});}catch{}
 let cls=0,clsTimer;try{new PerformanceObserver(list=>{for(const e of list.getEntries())if(!e.hadRecentInput)cls+=e.value;clearTimeout(clsTimer);clsTimer=setTimeout(()=>send('metric',{label:'CLS',value:cls}),3000);}).observe({type:'layout-shift',buffered:true});}catch{}
 let inp=0,inpTimer;try{new PerformanceObserver(list=>{for(const e of list.getEntries())if(e.interactionId)inp=Math.max(inp,e.duration);clearTimeout(inpTimer);inpTimer=setTimeout(()=>{if(inp)send('metric',{label:'INP',value:inp});},3000);}).observe({type:'event',durationThreshold:40,buffered:true});}catch{}
 // Navigation render is deferred; collect its initial view even if already fired.
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>{if(!pageSeen)send('page_view');},{once:true});else send('page_view');
})();
