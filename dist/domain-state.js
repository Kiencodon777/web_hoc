(function(root,factory){
  if(typeof module==='object'&&module.exports)module.exports=factory(require('./progress-merge.js'));
  else root.KienDomainState=factory(root.KienProgress);
})(typeof globalThis!=='undefined'?globalThis:this,function(Progress){
  'use strict';
  const keys=['su-ky-auth-token','su-ky-auth-user','su-ky-progress-v1','kienhoc-progress-v2',
    'kienhoc-cloud-meta-v1','kienhoc-progress-owner','kienhoc-info-choices-v1','kienhoc-ai-choices-v1',
    'kienhoc-lessons-v1','kienhoc-layout-v1','kienhoc-appearance-v1'];
  const TOKEN=keys[0],USER=keys[1],STORE=keys[2],V2=keys[3],META=keys[4],OWNER=keys[5],SESSION='su-ky-auth-session';
  const allowed=key=>keys.includes(key)||/^kienhoc-account-cache:[a-zA-Z0-9-]{1,128}$/.test(key);
  const parse=(value,fallback)=>{try{return JSON.parse(value)??fallback;}catch{return fallback;}};
  function capture(local,session){
    const data={version:1,local:{},session:{}};
    for(let i=0;i<local.length;i++){const key=local.key(i);if(allowed(key))data.local[key]=local.getItem(key);}
    const marker=session.getItem(SESSION);if(marker)data.session[SESSION]=marker;
    return data;
  }
  function snapshot(entries){
    const raw=parse(entries[STORE],Progress.blank());
    const base={...Progress.blank(),...raw};
    base._sync={...(raw._sync||{}),...parse(entries[META],{})};
    for(const [type,key]of [['ai',keys[7]],['info',keys[6]],['lessons',keys[8]]]){
      base._sync[type]={...(base._sync[type]||{})};
      for(const [id,value]of Object.entries(parse(entries[key],{})))
        if(!base._sync[type][id])base._sync[type][id]={value,at:0};
    }
    const v2=parse(entries[V2],null);
    if(v2?.version===2)base.subjects=Object.fromEntries(['history','ai','information'].map(id=>[id,v2[id]||Progress.blank()]));
    return Progress.merge(null,base);
  }
  function identity(state,now){
    const u=parse(state.local[USER],null);
    return u?.id&&u.email&&Number.isFinite(u.expiresAt)&&u.expiresAt>now&&state.local[TOKEN]&&
      (u.remember||state.session[SESSION]===u.id)?u:null;
  }
  function progressWrites(data){
    const out={[STORE]:JSON.stringify(data),[META]:JSON.stringify(data._sync||{})};
    if(data.subjects)out[V2]=JSON.stringify({version:2,...data.subjects});
    for(const [type,key]of [['ai',keys[7]],['info',keys[6]],['lessons',keys[8]]]){
      out[key]=JSON.stringify(Object.fromEntries(Object.entries(data._sync?.[type]||{}).filter(([,v])=>v.value).map(([id,v])=>[id,v.value])));
    }
    return out;
  }
  function plan(current,incoming,now=Date.now()){
    const local={...current.local},session={...current.session};
    const before=identity(current,now),after=identity(incoming,now);
    const owner=current.local[OWNER]||before?.id||null;
    const incomingOwner=incoming.local[OWNER]||after?.id||null;
    const conflict=!!owner&&owner!==incomingOwner;
    // Another account's progress is retained separately, never merged into the
    // currently active account merely because the browser changed hostname.
    if(conflict){
      if(incomingOwner){const key='kienhoc-account-cache:'+incomingOwner;
        local[key]=JSON.stringify(Progress.merge(parse(local[key],null),snapshot(incoming.local)));}
    }else{
      Object.assign(local,progressWrites(Progress.merge(snapshot(current.local),snapshot(incoming.local))));
      if(!owner&&incomingOwner)local[OWNER]=incomingOwner;
      if(!before&&after){local[TOKEN]=incoming.local[TOKEN];local[USER]=incoming.local[USER];
        if(after.remember)delete session[SESSION];else session[SESSION]=incoming.session[SESSION];}
      for(const key of [keys[9],keys[10]])if(!local[key]&&incoming.local[key])local[key]=incoming.local[key];
    }
    for(const [key,value]of Object.entries(incoming.local))if(key.startsWith('kienhoc-account-cache:'))
      local[key]=JSON.stringify(Progress.merge(parse(value,null),parse(local[key],null)));
    // Recovery copy intentionally excludes tokens/user profiles.
    const withoutAuth=entries=>Object.fromEntries(Object.entries(entries).filter(([key])=>![TOKEN,USER,OWNER].includes(key)));
    local['kienhoc-domain-transfer-backup-v1']=JSON.stringify({version:1,at:now,previous:withoutAuth(current.local),incoming:withoutAuth(incoming.local)});
    return {local,session,conflict};
  }
  function apply(local,session,result){
    const changes=[];
    try{
      for(const [key,value]of Object.entries(result.local)){const previous=local.getItem(key);if(previous===value)continue;
        changes.push([local,key,previous]);local.setItem(key,value);}
      for(const key of [SESSION]){const previous=session.getItem(key),value=result.session[key]??null;
        if(previous===value)continue;changes.push([session,key,previous]);if(value===null)session.removeItem(key);else session.setItem(key,value);}
    }catch(error){
      for(const [storage,key,value]of changes.reverse()){try{if(value===null)storage.removeItem(key);else storage.setItem(key,value);}catch{}}
      throw error;
    }
  }
  function recoveryCopy(state){return {version:1,local:Object.fromEntries(Object.entries(state.local).filter(([key])=>![TOKEN,USER,OWNER].includes(key))),session:{}};}
  return {capture,snapshot,plan,apply,recoveryCopy,allowed};
});
