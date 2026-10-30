function parseOrigins(value='http://localhost:3000') {
 return [...new Set(String(value).split(',').filter(x=>x.trim()).map(value=>{
  const u=new URL(value.trim());
  if(!['http:','https:'].includes(u.protocol)||u.username||u.password||u.pathname!=='/'||u.search||u.hash)throw Error('Origin cần là địa chỉ HTTP(S), không có path/query.');
  return u.origin;
 }))];
}
function sameOrigin(headers,origins){try{const origin=headers.get('origin');return origins.includes(origin)&&new URL(origin).host===headers.get('host');}catch{return false;}}
module.exports={parseOrigins,sameOrigin};
