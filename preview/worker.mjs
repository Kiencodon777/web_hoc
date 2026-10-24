// Public UI previews only. No production service, database, email or secret bindings.
const REPO='Kiencodon777/web_hoc';
const REFS=`https://github.com/${REPO}.git/info/refs?service=git-upload-pack`;
const RAW=`https://raw.githubusercontent.com/${REPO}/`;
const TYPES={html:'text/html; charset=utf-8',css:'text/css; charset=utf-8',js:'text/javascript; charset=utf-8',json:'application/json',svg:'image/svg+xml',png:'image/png',jpg:'image/jpeg',jpeg:'image/jpeg',webp:'image/webp',gif:'image/gif',ico:'image/x-icon',woff:'font/woff',woff2:'font/woff2',mp3:'audio/mpeg',mp4:'video/mp4'};
const CSP="default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: blob:; media-src 'self' blob:; connect-src 'self'; worker-src 'none'; object-src 'none'; frame-src 'none'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'";
const headers=(type='text/html; charset=utf-8',cache='no-store')=>({'Content-Type':type,'Cache-Control':cache,'X-Robots-Tag':'noindex, nofollow, noarchive','X-Content-Type-Options':'nosniff','Referrer-Policy':'no-referrer','Content-Security-Policy':CSP,'Permissions-Policy':'camera=(), microphone=(), geolocation=()'});
const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function page(title,text,status=200){return new Response(`<!doctype html><html lang="vi"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escape(title)} · Kiến Học preview</title><style>body{margin:8vh auto;padding:24px;max-width:640px;background:#10111b;color:#f4edf9;font:16px/1.7 system-ui}a{color:#d4bbff}input,button{padding:12px;font:inherit;border-radius:10px;border:1px solid #6b587d}input{width:110px}button{cursor:pointer}small{color:#b5a8c2}</style><h1>${escape(title)}</h1>${text}</html>`,{status,headers:headers()});}
function redirect(path){return new Response(null,{status:302,headers:{...headers(),'Location':path}});}
export async function handlePreview(request,{fetcher=fetch,cache=null}={}){
 const url=new URL(request.url);
 if(url.pathname==='/api'||url.pathname.startsWith('/api/')||url.pathname.includes('/api/'))return Response.json({error:'Đây là preview giao diện. OTP và đồng bộ tài khoản thật đã tắt.'},{status:503,headers:headers('application/json')});
 if(!['GET','HEAD'].includes(request.method))return new Response('Method not allowed',{status:405,headers:{...headers('text/plain'),'Allow':'GET, HEAD'}});
 if(url.pathname==='/')return page('Xem trước giao diện Kiến Học',`<p>Mở PR của bạn để xem và duyệt giao diện. Bản chính chỉ thay đổi khi Dũng triển khai riêng.</p><form action="/open"><label>Số PR <input name="pr" type="number" min="1" max="999999" required aria-label="Số Pull Request"></label> <button>Xem preview</button></form><p><a href="/pr/1/">Xem PR #1</a> · <a href="https://github.com/${REPO}/pulls">Danh sách PR trên GitHub</a></p><small>Không đăng nhập bằng tài khoản thật ở preview. Thao tác học chỉ lưu trong trình duyệt trên địa chỉ preview.</small>`);
 if(url.pathname==='/open'){const n=url.searchParams.get('pr');return /^[1-9]\d{0,5}$/.test(n||'')?redirect(`/pr/${n}/`):page('Số PR không hợp lệ','<p>Hãy nhập số PR trên GitHub.</p>',400);}
 const entry=url.pathname.match(/^\/pr\/([1-9]\d{0,5})\/?$/);
 if(entry){
  const number=entry[1],api=new Request(REFS,{headers:{'Git-Protocol':'version=1','User-Agent':'KienHoc-UI-Preview'}});
  let response=cache?await cache.match(api):null;
  if(!response){try{response=await fetcher(api,{redirect:'manual',signal:AbortSignal.timeout(15000)});}catch{return page('Chưa đọc được PR','<p>GitHub chưa phản hồi. Hãy thử lại sau.</p>',502);}
   if(response.ok&&cache){const stored=new Response(await response.clone().text(),{headers:{'Content-Type':'text/plain','Cache-Control':'public, max-age=30'}});await cache.put(api,stored);}}
  if(!response.ok)return page('Chưa mở được PR','<p>GitHub chưa phản hồi thành công. Hãy thử lại sau.</p>',503);
  const refs=await response.text();
  const sha=refs.match(new RegExp('([a-f0-9]{40}) refs/pull/'+number+'/head(?:\\n|\\x00|$)'))?.[1];
  if(!sha)return page('Không tìm thấy PR','<p>Kiểm tra lại số PR và bảo đảm PR đã được mở trên repo web_hoc.</p>',404);
  return redirect(`/pr/${number}/revision/${sha}/`);
 }
 const match=url.pathname.match(/^\/pr\/([1-9]\d{0,5})\/revision\/([a-f0-9]{40})\/(.*)$/);
 if(!match)return page('Không tìm thấy preview','<p>Link preview có dạng <code>/pr/1/</code>.</p>',404);
 const [,number,sha,tail]=match;let file;try{file=decodeURIComponent(tail||'index.html');}catch{return new Response('Bad path',{status:400,headers:headers('text/plain')});}
 if(file.split('/').some(p=>!p||p.startsWith('.')||!/^[-a-zA-Z0-9_ .]+$/.test(p))||file.includes('\\'))return new Response('Bad path',{status:400,headers:headers('text/plain')});
 const ext=file.split('.').pop().toLowerCase(),type=TYPES[ext];if(!type)return new Response('Unsupported asset',{status:404,headers:headers('text/plain')});
 // Force the local API config regardless of proposed code. CSP also denies external APIs.
 if(file==='api-config.js')return new Response("window.KIEN_CONFIG={apiBase:''};",{headers:headers(TYPES.js)});
 let upstream;try{upstream=await fetcher(RAW+sha+'/dist/'+file.split('/').map(encodeURIComponent).join('/'),{redirect:'manual',signal:AbortSignal.timeout(15000),cf:{cacheEverything:true,cacheTtl:3600}});}catch{return page('Chưa tải được source','<p>Không đọc được file từ GitHub. Hãy thử lại sau.</p>',502);}
 if(!upstream.ok)return new Response('File not found in this PR',{status:upstream.status===404?404:502,headers:headers('text/plain')});
 if(ext==='html'){
  let html=await upstream.text();
  if(!/<head\b/i.test(html)||!/<body\b/i.test(html))return page('Chưa có trang preview hợp lệ','<p>PR cần có dist/index.html chứa head và body.</p>',422);
  const prefix=`/pr/${number}/revision/${sha}/`;
  html=html.replace(/<base\b[^>]*>/gi,'').replace(/<head\b[^>]*>/i,x=>x+`<base href="${prefix}"><meta name="robots" content="noindex,nofollow"><style>#kien-preview-notice{position:sticky;top:0;z-index:2147483647;box-sizing:border-box;padding:10px 16px;background:#302340;color:#fff;font:12px/1.6 system-ui;border-bottom:1px solid #9670bb;display:flex;flex-wrap:wrap;gap:4px 14px}#kien-preview-notice a{color:#ead4ff;text-decoration:underline}</style>`).replace(/<body\b[^>]*>/i,x=>x+`<aside id="kien-preview-notice" aria-label="Thông tin bản xem trước"><strong>PREVIEW · PR #${number} · ${sha.slice(0,7)}</strong><span>OTP và đồng bộ thật đã tắt. Không nhập thông tin đăng nhập thật.</span><a href="/pr/${number}/">Nạp commit mới nhất</a><a href="https://github.com/${REPO}/pull/${number}" target="_blank" rel="noopener">Mở PR để duyệt</a></aside>`);
  return new Response(request.method==='HEAD'?null:html,{headers:headers(type)});
 }
 return new Response(request.method==='HEAD'?null:upstream.body,{headers:headers(type,'public, max-age=86400, immutable')});
}
export default {fetch(request){return handlePreview(request,{cache:caches.default});}};

