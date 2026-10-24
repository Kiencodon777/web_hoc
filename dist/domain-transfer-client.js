'use strict';
(()=>{
  const config=JSON.parse(document.getElementById('domain-config').textContent);
  const message=document.getElementById('message'),heading=document.getElementById('heading');
  const retry=document.getElementById('retry'),next=document.getElementById('continue'),download=document.getElementById('download');
  let captured;
  const handoff=new URLSearchParams(location.hash.slice(1)).get('handoff');
  if(config.mode==='receive')history.replaceState(null,'',location.pathname);
  async function api(path,body){
    const response=await fetch(path,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body),cache:'no-store',credentials:'omit',signal:AbortSignal.timeout(20000)});
    if(!response.ok)throw Error('Transfer failed');return response.json();
  }
  download.onclick=()=>{try{
    const state=KienDomainState.recoveryCopy(captured||config.payload||KienDomainState.capture(localStorage,sessionStorage));
    const url=URL.createObjectURL(new Blob([JSON.stringify(state)],{type:'application/json'}));
    const link=document.createElement('a');link.href=url;link.download='kienhoc-tien-do-khi-doi-dia-chi.json';link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
  }catch{message.textContent='Hãy quay lại địa chỉ cũ trên cùng trình duyệt. Dữ liệu cũ chưa bị xóa.';}};
  function fail(){
    document.body.className='error';heading.textContent='Chưa chuyển được phiên học';
    message.textContent='Trình duyệt chưa lưu được dữ liệu tại địa chỉ mới. Tiến độ ở địa chỉ cũ vẫn được giữ nguyên.';
    retry.hidden=false;download.hidden=false;
    retry.onclick=()=>config.mode==='export'?start():location.replace(config.sourceOrigin+'/');
  }
  async function start(){
    retry.hidden=true;
    try{
      if(config.mode==='export'){
        captured=KienDomainState.capture(localStorage,sessionStorage);
        const destination=config.canonicalOrigin+location.pathname+location.search+location.hash;
        if(!Object.keys(captured.local).length){location.replace(destination);return;}
        // Only an opaque single-use, two-minute handoff code crosses the URL.
        // The server encrypts browser data; no JWT or progress appears in links.
        const result=await api('/api/domain-transfer/create',{state:captured,returnTo:location.pathname+location.search+location.hash});
        location.replace(config.canonicalOrigin+'/domain-transfer/receive#handoff='+result.token);
      }else{
        if(!handoff)throw Error('Missing handoff');
        const received=await api('/api/domain-transfer/consume',{token:handoff});
        config.payload=received.state;config.returnTo=received.returnTo;config.sourceOrigin=received.sourceOrigin;
        const current=KienDomainState.capture(localStorage,sessionStorage);
        const result=KienDomainState.plan(current,config.payload);
        KienDomainState.apply(localStorage,sessionStorage,result);
        document.body.className='done';heading.textContent='Phiên học đã được chuyển';
        next.href=config.canonicalOrigin+config.returnTo;next.hidden=false;
        if(result.conflict){download.hidden=false;message.textContent='Địa chỉ mới đang dùng một tài khoản khác. Tiến độ từ địa chỉ cũ đã được giữ riêng để tránh trộn tài khoản. Bạn có thể tải bản sao, hoặc tiếp tục rồi đăng nhập đúng tài khoản.';}
        else{message.textContent='Tiến độ và bài học đang dở đã sẵn sàng. Đang mở không gian học tập của bạn.';location.replace(next.href);}
      }
    }catch{fail();}
  }
  start();
})();
