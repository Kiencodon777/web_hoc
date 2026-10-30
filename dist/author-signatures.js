'use strict';
/* Purpose-drawn name strokes using the supplied Apple Hello SVG drawing approach.
   The reference has fixed hello/xin chào paths, not a reusable font. */
(()=>{
 const glyphs={
  D:{w:55,d:['M12 73C19 53 27 28 27 14','M10 19C39 2 65 14 57 40C51 61 31 80 12 73']},
  u:{w:39,d:['M7 40C4 53-2 72 10 73C22 73 30 53 33 40L27 64C24 75 32 76 41 65']},
  n:{w:43,d:['M5 41L0 73C10 51 21 33 30 40C39 48 22 72 33 74C38 75 43 70 47 65']},
  g:{w:42,d:['M33 43C23 31 5 39 3 57C1 74 17 78 29 52L34 39C26 79 20 103 9 104C-7 104 2 86 41 68']},
  P:{w:48,d:['M8 74C14 56 23 27 27 12','M12 19C40 3 65 15 54 34C47 47 31 49 18 45']},
  h:{w:44,d:['M4 73C14 44 30 12 25 8C11-2 1 39 4 65C14 44 29 32 33 42C38 54 21 75 35 74L47 65']},
  a:{w:40,d:['M33 43C22 31 4 40 3 58C1 76 17 77 31 47L27 64C24 75 33 77 43 65']},
  m:{w:65,d:['M6 41L0 73C13 48 24 34 29 41C34 48 23 64 21 73C35 49 46 34 51 41C58 51 39 72 53 75L68 65']},
  V:{w:57,d:['M4 18C22 0 11 64 23 73C33 77 49 37 59 12']},
  i:{w:22,d:['M8 41L3 62C0 76 11 77 24 65','M12 27L12 27.2']},
  e:{w:37,d:['M1 57C30 52 31 33 18 38C2 44-2 68 12 73C22 76 32 69 40 62']},
  t:{w:30,d:['M18 24C15 37 9 55 8 64C5 77 17 77 33 65','M3 43L30 40']},
  K:{w:59,d:['M9 74C19 52 29 23 29 12','M16 52C34 35 47 27 58 13','M31 40C26 54 29 71 43 75C51 76 58 68 63 62']}
 };
 const names=[{text:'Dũng Phạm',letters:[['D'],['u','tilde'],['n'],['g'],[' '],['P'],['h'],['a','dot'],['m']]},{text:'Viết Kiên',letters:[['V'],['i'],['e','circumflex-acute'],['t'],[' '],['K'],['i'],['e','circumflex'],['n']]}];
 const accents={tilde:'M10 24C16 13 24 32 32 20',dot:'M18 88L18 88.3',circumflex:'M12 28L24 18L33 27','circumflex-acute':'M12 28L24 18L33 27M34 14L43 5'};
 function svg(name,index){let x=7,order=index*13,paths=[];for(const [letter,accent] of name.letters){if(letter===' '){x+=20;continue;}const glyph=glyphs[letter];for(const d of glyph.d){paths.push(`<path d="${d}" transform="translate(${x} 0)" pathLength="1" data-pen-order="${order++}"/>`);}if(accent)paths.push(`<path class="author-accent" d="${accents[accent]}" transform="translate(${x} 0)" pathLength="1" data-pen-order="${order++}"/>`);x+=glyph.w;}
  return `<svg class="author-signature" viewBox="0 -3 ${x+14} 119" fill="none" stroke="currentColor" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${paths.join('')}</svg>`;
 }
 function markup(){return `<span class="sr-only">Dũng Phạm &amp; Viết Kiên</span><span class="author-signature-name" aria-hidden="true">${svg(names[0],0)}</span><i class="author-signature-amp" aria-hidden="true">&amp;</i><span class="author-signature-name" aria-hidden="true">${svg(names[1],1)}</span>`;}
 let played=false,dispose=()=>{};
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const motion=()=>!reduced.matches&&(!window.KienUI||window.KienUI.motionEnabled());
 function mount(){dispose();dispose=()=>{};const root=document.querySelector('.footer-author-signatures');if(!root||played||!motion())return;root.classList.add('signature-awaiting');let animations=[],started=false,visible=false;
  function show(){root.classList.remove('signature-awaiting');animations.forEach(a=>a.cancel());animations=[];}
  function sync(){if(!motion()){played=true;started=true;show();return;}if(started)for(const a of animations){if(a.playState==='finished'||a.playState==='idle')continue;if(document.hidden||!visible)a.pause();else if(a.playState==='paused')a.play();}}
  function start(){started=true;played=true;root.classList.remove('signature-awaiting');const paths=[...root.querySelectorAll('path')];animations=paths.map((path,i)=>path.animate([{strokeDashoffset:1,opacity:0},{strokeDashoffset:0,opacity:1}],{duration:path.classList.contains('author-accent')?240:480,delay:i*145,easing:'cubic-bezier(.45,0,.25,1)',fill:'both'}));}
  const io=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;if(visible&&!started&&motion())start();sync();},{threshold:.35});io.observe(root);document.addEventListener('visibilitychange',sync);document.addEventListener('kien-motion-change',sync);reduced.addEventListener('change',sync);
  dispose=()=>{io.disconnect();show();document.removeEventListener('visibilitychange',sync);document.removeEventListener('kien-motion-change',sync);reduced.removeEventListener('change',sync);};
 }
 window.KienAuthors={markup,mount};
})();
