const object=x=>!!x&&typeof x==='object'&&!Array.isArray(x),key=k=>/^\d{1,3}\.\d{1,4}$/.test(k),num=x=>Number.isSafeInteger(x)&&x>=0&&x<=1e13;
function validProgress(x,subject=null){
 const key=subject?k=>subject==='history'?/^history\.\d{1,3}\.\d{1,4}$/.test(k):new RegExp('^'+subject+'\\.\\d{1,3}$').test(k):k=>/^\d{1,3}\.\d{1,4}$/.test(k);
 if(x?.subjects!==undefined){if(subject||!object(x.subjects)||Object.keys(x.subjects).some(k=>!['history','ai','information'].includes(k))||!['history','ai','information'].every(id=>validProgress(x.subjects[id],id)))return false;}

 if(!object(x)||x.version!==1||!object(x.progress)||!Array.isArray(x.bookmarks)||x.bookmarks.length>1000||Object.keys(x.progress).length>1000)return false;
 function safe(value,depth=0){if(depth>12)return false;if(value&&typeof value==='object'){if(Object.keys(value).length>2000)return false;return Object.entries(value).every(([k,v])=>!['__proto__','constructor','prototype'].includes(k)&&safe(v,depth+1));}return typeof value!=='string'||value.length<=10000;}
 if(!safe(x)||JSON.stringify(x).length>500000)return false;
 if(!x.bookmarks.every(key)||!Object.entries(x.progress).every(([k,p])=>key(k)&&object(p)&&num(p.attempts)&&num(p.correct)&&p.correct<=p.attempts&&(typeof p.last==='boolean'||!!subject&&p.last===null)&&['','A','B','C','D'].includes(p.lastAnswer)&&num(p.at)))return false;
 if(x.prefs&&(!object(x.prefs)||typeof x.prefs.sound!=='boolean'||!Number.isFinite(x.prefs.speechRate)||x.prefs.speechRate<.6||x.prefs.speechRate>1.5))return false;
 const s=x.session;if(s!=null&&(!object(s)||!Array.isArray(s.keys)||!s.keys.length||s.keys.length>400||!s.keys.every(key)||!Number.isInteger(s.index)||s.index<0||s.index>=s.keys.length||!['learn','exam'].includes(s.mode)||!num(s.created)||(subject&&s.subject!==subject)||(s.deadline!=null&&!num(s.deadline))||!object(s.answers)||!Object.entries(s.answers).every(([k,v])=>s.keys.includes(k)&&['A','B','C','D'].includes(v))))return false;
 const m=x._sync;if(m){if(!object(m))return false;for(const k of ['sessionAt','prefsAt','resetAt'])if(m[k]!==undefined&&!num(m[k]))return false;for(const type of ['bookmarks','ai','info','lessons']){if(m[type]!==undefined&&(!object(m[type])||!Object.entries(m[type]).every(([k,v])=>(type==='bookmarks'?key(k):(type==='ai'||type==='info')?/^\d{1,3}$/.test(k):/^(ai|information):[0-3]$/.test(k))&&object(v)&&num(v.at)&&((type==='ai'||type==='info')?['A','B','C','D',null].includes(v.value):typeof v.value==='boolean'))))return false;}}
 return true;
}
module.exports={validProgress};
