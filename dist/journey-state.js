'use strict';
// View-only state. Never changes a quiz's answers, order, deadline or stored schema.
(()=>{
 let current=null;const positions=new Map();
 const key=session=>session?JSON.stringify([session.subject,session.created,session.keys]):null;
 function capture(){const grid=document.querySelector('.questiongrid');if(current&&grid&&Number.isFinite(grid.scrollTop)){positions.set(current,{top:grid.scrollTop,left:grid.scrollLeft||0});while(positions.size>6)positions.delete(positions.keys().next().value);}}
 function restore(session){current=key(session);if(!current)return;const grid=document.querySelector('.questiongrid');if(!grid)return;const position=positions.get(current);if(position){grid.scrollTop=position.top;grid.scrollLeft=position.left;return;}
  // A reloaded/resumed session starts with its active question visible, not row one.
  const selected=grid.querySelector('[aria-current="step"]');if(!selected)return;const item=selected.getBoundingClientRect(),viewport=grid.getBoundingClientRect();if(item.bottom>viewport.bottom)grid.scrollTop+=item.bottom-viewport.bottom+8;else if(item.top<viewport.top)grid.scrollTop+=item.top-viewport.top-8;
 }
 window.KienJourney={capture,restore};
})();
