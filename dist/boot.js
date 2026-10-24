'use strict';
// Keep initial HTML independent of the legacy UI. Never wait for fonts or effects.
(()=>{
 let ready=false;
 const notice=document.getElementById('app-boot'),message=document.getElementById('app-boot-message'),retry=document.getElementById('app-boot-retry');
 retry.hidden=true;
 function failed(text='Chưa tải được giao diện. Bạn hãy thử tải lại trang.'){if(ready)return;message.textContent=text;retry.hidden=false;}
 const error=e=>{if(e.target?.tagName==='SCRIPT'||e instanceof ErrorEvent)failed();};
 const slow=setTimeout(()=>failed('Trang đang tải lâu hơn bình thường. Bạn có thể đợi thêm hoặc tải lại.'),15000);
 window.addEventListener('error',error,true);
 document.addEventListener('DOMContentLoaded',()=>{if(!ready)failed();},{once:true});
 window.KienBoot={ready(){if(ready)return;ready=true;clearTimeout(slow);window.removeEventListener('error',error,true);document.querySelectorAll('[data-app-shell]').forEach(el=>el.hidden=false);notice.hidden=true;}};
})();
