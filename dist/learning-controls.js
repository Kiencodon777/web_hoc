'use strict';
// Progressive enhancement: native select values/change events remain the source of truth.
(()=>{
 const controls=new Map();let panel,active=null,cursor=-1,serial=0,typed='',typedAt=0;
 const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const chevron='<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="m5 8 5 5 5-5"/></svg>';
 const check='<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="m4 10 4 4 8-8"/></svg>';
 function close(restore=false){const entry=active;active=null;typed='';if(panel){panel.hidden=true;panel.replaceChildren();panel.removeAttribute('aria-activedescendant');}if(entry){entry.button.setAttribute('aria-expanded','false');if(restore&&entry.button.isConnected)entry.button.focus({preventScroll:true});}}
 function sync(entry){const select=entry.select;entry.value.textContent=select.selectedOptions[0]?.textContent||'Chọn một mục';entry.button.disabled=select.disabled;if(!entry.hasLabel)entry.button.setAttribute('aria-label',entry.label+': '+entry.value.textContent);}
 function refresh(){if(active&&!active.select.isConnected)close();for(const [select]of controls)if(!select.isConnected)controls.delete(select);
  for(const select of document.querySelectorAll('#main select')){if(select.multiple)continue;if(controls.has(select)){sync(controls.get(select));continue;}
   const n=++serial,wrapper=document.createElement('span'),button=document.createElement('button'),value=document.createElement('span'),label=select.id?document.querySelector(`label[for="${select.id}"]`):null;
   wrapper.className='learning-choice';button.type='button';button.className='choice-trigger';button.id=select.id+'-choice';button.dataset.learningChoice=select.id;button.setAttribute('aria-haspopup','listbox');button.setAttribute('aria-expanded','false');button.setAttribute('aria-controls','learning-choice-list');
   value.id='choice-value-'+n;value.className='choice-value';button.append(value);button.insertAdjacentHTML('beforeend',chevron);
   const labelText=label?.textContent.trim()||(select.id==='result-filter'?'Lọc câu xem lại':'Lựa chọn');
   if(label){label.id||='choice-label-'+n;label.htmlFor=button.id;button.setAttribute('aria-labelledby',label.id+' '+value.id);}else button.setAttribute('aria-label',labelText);
   select.before(wrapper);wrapper.append(select,button);select.hidden=true;
   const entry={select,button,value,label:labelText,hasLabel:!!label};controls.set(select,entry);sync(entry);
   select.addEventListener('change',()=>sync(entry));button.addEventListener('click',()=>active===entry?close(true):open(entry));button.addEventListener('keydown',e=>{if(['ArrowDown','ArrowUp','Enter',' '].includes(e.key)){e.preventDefault();open(entry,e.key==='ArrowUp'?-1:1);}else if(e.key==='Escape')close(true);});
  }
 }
 function move(index){if(!active)return;const options=Array.from(active.select.options),enabled=options.map((o,i)=>!o.disabled?i:-1).filter(i=>i>=0);if(!enabled.length)return;cursor=enabled.includes(index)?index:enabled[0];const items=Array.from(panel.querySelectorAll('[role="option"]'));items.forEach((item,i)=>item.classList.toggle('is-active',i===cursor));panel.setAttribute('aria-activedescendant',items[cursor].id);items[cursor].scrollIntoView({block:'nearest'});}
 function open(entry,direction=1){if(entry.select.disabled)return;close();active=entry;if(!panel){panel=document.createElement('div');panel.id='learning-choice-list';panel.className='choice-list';panel.setAttribute('role','listbox');panel.tabIndex=-1;document.body.append(panel);panel.addEventListener('keydown',key);panel.addEventListener('click',e=>{const item=e.target.closest('[data-choice-index]');if(item)choose(Number(item.dataset.choiceIndex));});}
  panel.setAttribute('aria-label',entry.label);panel.innerHTML=`<div class="choice-list-heading" aria-hidden="true">${escape(entry.label)}</div>${Array.from(entry.select.options,(option,i)=>`<div id="learning-option-${i}" class="choice-list-option" role="option" data-choice-index="${i}" aria-selected="${option.selected}" ${option.disabled?'aria-disabled="true"':''}><span>${escape(option.textContent)}</span><i aria-hidden="true">${option.selected?check:''}</i></div>`).join('')}`;
  panel.hidden=false;const r=entry.button.getBoundingClientRect(),vw=document.documentElement.clientWidth||innerWidth,w=Math.min(Math.max(r.width,280),vw-24);panel.style.width=w+'px';panel.style.left=Math.max(12,Math.min(vw-w-12,r.left))+'px';const below=innerHeight-r.bottom-20,above=r.top-20,up=below<Math.min(240,panel.scrollHeight)&&above>below;panel.style.maxHeight=Math.max(90,Math.min(360,up?above:below))+'px';panel.style.top=(up?Math.max(12,r.top-panel.offsetHeight-8):Math.min(innerHeight-100,r.bottom+8))+'px';
  entry.button.setAttribute('aria-expanded','true');panel.focus({preventScroll:true});const selected=entry.select.selectedIndex;move(selected>=0&&!entry.select.options[selected].disabled?selected:direction<0?entry.select.options.length-1:0);
 }
 function choose(index){if(!active||!active.select.options[index]||active.select.options[index].disabled)return;const entry=active,id=entry.button.id,changed=entry.select.selectedIndex!==index;entry.select.selectedIndex=index;sync(entry);close(true);if(changed){entry.select.dispatchEvent(new Event('change',{bubbles:true}));document.getElementById(id)?.focus({preventScroll:true});}}
 function key(e){if(!active)return;const options=Array.from(active.select.options),enabled=options.map((o,i)=>!o.disabled?i:-1).filter(i=>i>=0);if(['ArrowDown','ArrowUp','Home','End','Enter',' ','Escape'].includes(e.key)){e.preventDefault();e.stopPropagation();if(e.key==='Escape'){close(true);return;}if(e.key==='Enter'||e.key===' '){choose(cursor);return;}const pos=enabled.indexOf(cursor);move(e.key==='Home'?enabled[0]:e.key==='End'?enabled.at(-1):enabled[Math.max(0,Math.min(enabled.length-1,pos+(e.key==='ArrowDown'?1:-1)))]);}
  else if(e.key==='Tab'){close(true);}
  else if(e.key.length===1&&!e.ctrlKey&&!e.metaKey&&!e.altKey){e.preventDefault();const now=Date.now();typed=now-typedAt>700?e.key:typed+e.key;typedAt=now;const normalize=s=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLocaleLowerCase('vi');const match=enabled.find(i=>normalize(options[i].textContent.trim()).startsWith(normalize(typed)));if(match!==undefined)move(match);}
 }
 document.addEventListener('pointerdown',e=>{if(active&&!panel.contains(e.target)&&!active.button.contains(e.target))close();});
 document.addEventListener('focusin',e=>{if(active&&!panel.contains(e.target)&&!active.button.contains(e.target))close();});
 window.addEventListener('resize',()=>close());window.addEventListener('scroll',()=>close(),{passive:true});
 window.KienChoices={refresh,close};
})();
