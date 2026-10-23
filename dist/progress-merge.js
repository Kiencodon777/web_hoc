/* Shared deterministic merge: latest answer wins; counts use max, never sum retries. */
(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory();else root.KienProgress=factory();})(typeof globalThis==='object'?globalThis:this,()=>{
 const blank=()=>({version:1,progress:{},bookmarks:[],session:null,prefs:{sound:true,speechRate:.9},_sync:{bookmarks:{},ai:{},info:{},lessons:{},sessionAt:0,prefsAt:0,resetAt:0}});
 const stamp=x=>Number(x?.at)||0;
 function merge(a,b){a=a||blank();b=b||blank();const out=blank(),am=a._sync||{},bm=b._sync||{},reset=Math.max(am.resetAt||0,bm.resetAt||0);out._sync.resetAt=reset;
  for(const key of new Set([...Object.keys(a.progress||{}),...Object.keys(b.progress||{})])){const ax=a.progress?.[key],by=b.progress?.[key],x=stamp(ax)>=reset?ax:null,y=stamp(by)>=reset?by:null,winner=y&&(!x||stamp(y)>=stamp(x))?y:x;if(!winner||stamp(winner)<reset)continue;out.progress[key]={...winner,attempts:Math.max(x?.attempts||0,y?.attempts||0),correct:Math.max(x?.correct||0,y?.correct||0)};}
  for(const type of ['bookmarks','ai','info','lessons']){const x={...(am[type]||{})},y={...(bm[type]||{})};if(type==='bookmarks'){for(const key of a.bookmarks||[])x[key]||={value:true,at:0};for(const key of b.bookmarks||[])y[key]||={value:true,at:0};}for(const key of new Set([...Object.keys(x),...Object.keys(y)]))out._sync[type][key]=y[key]&&(!x[key]||stamp(y[key])>=stamp(x[key]))?y[key]:x[key];}
  out.bookmarks=Object.keys(out._sync.bookmarks).filter(k=>out._sync.bookmarks[k].value&&stamp(out._sync.bookmarks[k])>=reset);
  for(const field of ['session','prefs']){const clock=field+'At';const src=(bm[clock]||0)>=(am[clock]||0)?b:a;out[field]=src[field]??out[field];out._sync[clock]=Math.max(am[clock]||0,bm[clock]||0);}if(out._sync.sessionAt<reset)out.session=null;
  if(a.subjects||b.subjects){out.subjects={};for(const id of ['history','ai','information'])out.subjects[id]=merge(a.subjects?.[id],b.subjects?.[id]);
   // v13 clients still write the legacy envelope; bring newer legacy answers forward.
   const h=out.subjects.history;for(const[k,v]of Object.entries(out.progress))if(stamp(v)>=(h._sync.resetAt||0)&&(!h.progress['history.'+k]||stamp(v)>stamp(h.progress['history.'+k])))h.progress['history.'+k]={...v};
   for(const[k,v]of Object.entries(out._sync.bookmarks||{})){const key='history.'+k;if(stamp(v)>stamp(h._sync.bookmarks[key])||!h._sync.bookmarks[key])h._sync.bookmarks[key]={...v};}h.bookmarks=Object.keys(h._sync.bookmarks).filter(k=>h._sync.bookmarks[k].value&&stamp(h._sync.bookmarks[k])>=(h._sync.resetAt||0));
   if(out._sync.sessionAt>h._sync.sessionAt&&out._sync.sessionAt>=(h._sync.resetAt||0)){const s=out.session,map=x=>Object.fromEntries(Object.entries(x||{}).map(([k,v])=>['history.'+k,v]));h.session=s?{...s,subject:'history',keys:s.keys.map(k=>'history.'+k),answers:map(s.answers),hints:map(s.hints),hintsUsed:map(s.hintsUsed)}:null;h._sync.sessionAt=out._sync.sessionAt;}
   for(const [id,type]of [['ai','ai'],['information','info']])for(const[k,v]of Object.entries(out._sync[type]||{})){const key=id+'.'+k;if(v.value&&stamp(v)>=(out.subjects[id]._sync.resetAt||0)&&(!out.subjects[id].progress[key]||stamp(v)>stamp(out.subjects[id].progress[key])))out.subjects[id].progress[key]={attempts:1,correct:0,last:null,lastAnswer:v.value,at:stamp(v)};}
  }
  return out;
 }
 return {blank,merge};
});
