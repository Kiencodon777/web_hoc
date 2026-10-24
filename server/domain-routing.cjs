const MAX_STATE_BYTES = 2_000_000;
const FIXED_KEYS = ['su-ky-auth-token','su-ky-auth-user','su-ky-progress-v1','kienhoc-progress-v2',
  'kienhoc-cloud-meta-v1','kienhoc-progress-owner','kienhoc-info-choices-v1','kienhoc-ai-choices-v1',
  'kienhoc-lessons-v1','kienhoc-layout-v1','kienhoc-appearance-v1'];
const allowedKey = key => FIXED_KEYS.includes(key) || /^kienhoc-account-cache:[a-zA-Z0-9-]{1,128}$/.test(key);
function safeJSON(value,depth=0){
  if(depth>20)return false;
  if(value&&typeof value==='object')return Object.keys(value).length<=5000&&Object.entries(value).every(([key,v])=>
    !['__proto__','constructor','prototype'].includes(key)&&safeJSON(v,depth+1));
  return true;
}
function validEntry(key,value){
  if(!allowedKey(key)||typeof value!=='string'||value.length>1_000_000)return false;
  if(key==='su-ky-auth-token')return value.length<=10000;
  if(key==='kienhoc-progress-owner')return value.length<=128;
  try{return safeJSON(JSON.parse(value));}catch{return false;}
}
function validTransfer(value) {
  return value && value.version === 1 && value.local && typeof value.local === 'object' &&
    !Array.isArray(value.local) && Object.keys(value.local).length <= 64 &&
    Object.entries(value.local).every(([key,v]) => validEntry(key,v)) &&
    value.session && typeof value.session === 'object' && !Array.isArray(value.session) &&
    Object.entries(value.session).every(([key,v]) => key === 'su-ky-auth-session' && typeof v === 'string' && v.length <= 128) &&
    new TextEncoder().encode(JSON.stringify(value)).byteLength <= MAX_STATE_BYTES;
}
const jsonForHTML = value => JSON.stringify(value).replace(/[<>&\u2028\u2029]/g,c=>'\\u'+c.charCodeAt(0).toString(16).padStart(4,'0'));
function migrationPage(config) {
  const headers = {
    'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-store','Referrer-Policy':'no-referrer',
    'X-Content-Type-Options':'nosniff','X-Frame-Options':'DENY',
    'Content-Security-Policy':`default-src 'none'; script-src 'self'; style-src 'self'; connect-src 'self'; base-uri 'none'; frame-ancestors 'none'`
  };
  const html = `<!doctype html><html lang="vi"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="referrer" content="no-referrer"><title>Kiến Học — Chuyển tiếp phiên học</title><link rel="stylesheet" href="/domain-transfer.css"></head><body><main><p class="brand">KIẾN HỌC</p><div class="indicator" aria-hidden="true"></div><h1 id="heading">Đang chuyển phiên học của bạn</h1><p id="message" role="status" aria-live="polite">Đang chuẩn bị tiến độ và bài học đang dở để tiếp tục tại địa chỉ chính.</p><p class="address">study.anhdungece.id.vn</p><p id="detail" class="muted">Dữ liệu ở địa chỉ cũ được giữ lại trong quá trình chuyển.</p><div class="actions"><button id="retry" type="button" hidden>Thử lại</button><a id="continue" href="${config.canonicalOrigin}/" hidden>Tiếp tục học</a><button id="download" type="button" hidden>Tải bản sao tiến độ</button></div><noscript>Bật JavaScript để chuyển tiến độ. Dữ liệu cũ vẫn được giữ trong trình duyệt này.</noscript></main><script id="domain-config" type="application/json">${jsonForHTML(config)}</script><script src="/progress-merge.js"></script><script src="/domain-state.js"></script><script src="/domain-transfer-client.js"></script></body></html>`;
  return new Response(html,{headers});
}
async function handleDomainRouting(request, config) {
  const canonical = config.CANONICAL_ORIGIN;
  if(!canonical || config.CANONICAL_ENABLED!=='true')return null;
  const target=new URL(canonical),url=new URL(request.url);
  if(target.protocol!=='https:' || target.origin!==canonical)throw Error('Invalid canonical origin');
  const sources=(config.MIGRATION_SOURCE_ORIGINS||'').split(',').map(x=>x.trim()).filter(Boolean);
  if(url.pathname==='/domain-transfer/receive'){
    if(request.method!=='GET')return new Response('Method not allowed',{status:405,headers:{Allow:'GET','Cache-Control':'no-store'}});
    if(url.origin!==canonical)return new Response('Địa chỉ nhận không hợp lệ.',{status:403});
    return migrationPage({mode:'receive',canonicalOrigin:canonical,sourceOrigin:sources[0]});
  }
  if(url.origin!==canonical && request.method==='GET' && (url.pathname==='/'||url.pathname==='/index.html')){
    if(sources.includes(url.origin))return migrationPage({mode:'export',canonicalOrigin:canonical});
    return Response.redirect(canonical+url.pathname+url.search,308);
  }
  return null;
}
module.exports={handleDomainRouting,validTransfer,jsonForHTML,migrationPage,FIXED_KEYS,MAX_STATE_BYTES};
