'use strict';
(()=>{
 const themes=new Set(['sakura','grid','gradient','chrome','topography','wave','still']);
 function read(raw){
  let stored;try{stored=JSON.parse(raw||'{}');}catch{}
  if(!stored||typeof stored!=='object')stored={};
  // Legacy settings had two page scopes. Preserve the home choice on migration;
  // keep both legacy fields in sync for domain transfers and older clients.
  const theme=[stored.theme,stored.landing,stored.study,'sakura'].find(t=>themes.has(t));
  const brightness=Number(stored.brightness);
  return {theme,landing:theme,study:theme,motion:stored.motion!==false,brightness:Number.isFinite(brightness)?Math.max(15,Math.min(80,brightness)):45};
 }
 function select(state,theme){if(!themes.has(theme))return false;state.theme=state.landing=state.study=theme;return true;}
 window.KienAppearance={read,select};
})();
