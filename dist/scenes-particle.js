/* Adapted from supplied particle-title reference; single entrance. */
window.KienScenes=window.KienScenes||{};
(()=>{
                                    
                                                          
                                                                
                                                                       
                                                                                    
                                                      

const MODES         = ["smoke", "vortex", "sand", "burst", "sweep", "absorb"];
const TIMING = { hold: 5200, field: 1400, travel: 1750 };

const LIGHT          = {
  ink: [32, 32, 32],
  page: [244, 245, 247],
  blobs: [
    { rgb: [176, 196, 214], a: 0.55, fx: 0.04, fy: 0.08, fw: 0.62, fh: 0.78 },
    { rgb: [255, 255, 255], a: 0.85, fx: 0.44, fy: 0.22, fw: 0.54, fh: 0.7 },
    { rgb: [226, 208, 196], a: 0.42, fx: 0.3, fy: 0.44, fw: 0.44, fh: 0.56 },
  ],
};
const DARK          = {
  ink: [244, 244, 246],
  page: [12, 12, 14],
  blobs: [
    { rgb: [86, 112, 160], a: 0.5, fx: 0.04, fy: 0.08, fw: 0.62, fh: 0.78 },
    { rgb: [140, 130, 190], a: 0.28, fx: 0.44, fy: 0.22, fw: 0.54, fh: 0.7 },
    { rgb: [150, 104, 84], a: 0.34, fx: 0.3, fy: 0.44, fw: 0.44, fh: 0.56 },
  ],
};

function createRng(seed        )               {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const clamp = (t        ) => (t < 0 ? 0 : t > 1 ? 1 : t);
const mix = (a        , b        , t        ) => a + (b - a) * t;
const smooth = (t        ) => {
  const c = clamp(t);
  return c * c * (3 - 2 * c);
};
const ease = (t        ) => {
  const c = clamp(t);
  return c < 0.5 ? 4 * c * c * c : 1 - Math.pow(-2 * c + 2, 3) / 2;
};

function createModeBag(seed        )             {
  const r = createRng(seed);
  let bag         = [];
  let last              = null;
  return () => {
    if (!bag.length) {
      bag = MODES.slice();
      for (let i = bag.length - 1; i > 0; i--) {
        const j = Math.floor(r() * (i + 1));
        [bag[i], bag[j]] = [bag[j], bag[i]];
      }
      if (bag[bag.length - 1] === last) [bag[0], bag[bag.length - 1]] = [bag[bag.length - 1], bag[0]];
    }
    last = bag.pop()        ;
    return last;
  };
}

function blobStrength(b      , A     , x        , y        ) {
  const bw = b.fw * A.w, bh = b.fh * A.h;
  const cx = A.x + b.fx * A.w + bw / 2, cy = A.y + b.fy * A.h + bh / 2;
  return Math.max(0, 1 - Math.hypot((x - cx) / (bw / 2), (y - cy) / (bh / 2))) * b.a;
}

function rimMask(A     , x        , y        ) {
  const r = Math.hypot((x - (A.x + A.w / 2)) / (A.w / 2), (y - (A.y + A.h / 2)) / (A.h / 2));
  return r < 0.55 ? 1 : r >= 1 ? 0 : 1 - (r - 0.55) / 0.45;
}

function glowAt(pal         , A     , x        , y        )                        {
  let [r, g, b] = pal.page;
  let vis = 0;
  const m = rimMask(A, x, y);
  for (const bl of pal.blobs) {
    const s = blobStrength(bl, A, x, y) * m;
    r = mix(r, bl.rgb[0], s);
    g = mix(g, bl.rgb[1], s);
    b = mix(b, bl.rgb[2], s);
    vis = Math.max(vis, s);
  }
  return { c: [r, g, b], s: vis };
}

function sampleFieldPoint(pal         , rand              , f       , A     ) {
  let best                                                     = null;
  for (let k = 0; k < 4; k++) {
    const a = rand() * 6.2832;
    const q = Math.pow(rand(), 0.6);
    const x = f.cx + Math.cos(a) * f.rx * q;
    const y = f.cy + Math.sin(a) * f.ry * q;
    const g = glowAt(pal, A, x, y);
    if (!best || g.s > best.s) best = { x, y, c: g.c, s: g.s };
  }
  return best                                               ;
}

/* ------------------------------------------------------------------ */
/* Canvas engine                                                       */
/* ------------------------------------------------------------------ */

             
                                                                                                 
                                                                                    
                                       
  
                                                           

function plan(mode      , p      , W        , H        ) {
  switch (mode) {
    case "smoke": return { delay: (1 - clamp(p.ny)) * 0.35 + p.r3 * 0.25, bend: (p.r1 - 0.5) * 150 };
    case "vortex":
      return {
        delay: (Math.hypot(p.hx - W / 2, p.hy - H / 2) / Math.max(1, W)) * 0.9 + p.r3 * 0.15,
        bend: (p.r2 > 0.5 ? 1 : -1) * (90 + p.r1 * 140),
      };
    case "sand": return { delay: p.nx * 0.6 + p.r3 * 0.18, bend: (p.r1 - 0.5) * 60 };
    case "burst": return { delay: p.r3 * 0.1, bend: (p.r2 - 0.5) * 26 };
    case "sweep": return { delay: (1 - p.nx) * 0.6 + p.r3 * 0.18, bend: -(60 + p.r1 * 90) };
    default: return { delay: p.r1 * 0.55, bend: (p.r2 - 0.5) * 100 };
  }
}

function bowAt(a                  , b                  , bend        , t        ) {
  const e = ease(t), dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy) || 1;
  const bow = Math.sin(e * Math.PI) * bend;
  return [mix(a[0], b[0], e) + (-dy / L) * bow, mix(a[1], b[1], e) + (dx / L) * bow, e]         ;
}

const rgbStr = (a     , b     , t        ) => {
  const c = (i        ) => Math.max(0, Math.min(255, Math.round(mix(a[i], b[i], t))));
  return `rgb(${c(0)},${c(1)},${c(2)})`;
};

                                                                                            

const INTRO_LEAD = 0.08;
const FONT_STACK = '"Be Vietnam Pro",system-ui,sans-serif';

function createEngine(cv                   , text        , pal         )                {
  const ctx = cv.getContext("2d");
  if (!ctx) return null;
  const textCv = document.createElement("canvas");
  const nextMode = createModeBag((Date.now() & 0xffff) ^ 0x5a5a);
  let W = 0, H = 0, dpr = 1;
  let field        = { cx: 0, cy: 0, rx: 0, ry: 0 };
  let box      = { x: 0, y: 0, w: 0, h: 0 };
  let parts         = [];
  let phase        = "gathering", mode       = nextMode(), phaseStart = 0, raf = 0, timer = 0;
  let intro = true, active = true, destroyed = false;

  function reroll() {
    const r = createRng((Math.random() * 1e9) | 0);
    for (const p of parts) { const q = sampleFieldPoint(pal, r, field, box); p.fx = q.x; p.fy = q.y; p.fc = q.c; }
  }

  function build() {
    W = cv.clientWidth; H = cv.clientHeight;
    dpr = Math.min(2, window.devicePixelRatio || 1);
    cv.width = Math.max(1, Math.round(W * dpr)); cv.height = Math.max(1, Math.round(H * dpr));
    textCv.width = cv.width; textCv.height = cv.height;
    ctx .setTransform(1, 0, 0, 1, 0, 0);
    const fs = Math.max(40, Math.min(128, W * 0.17));
    const ty = H / 2;
    box = { x: 0, y: 0, w: W, h: H };
    field = { cx: W / 2, cy: H / 2, rx: Math.min(560, W * 0.4), ry: Math.min(260, H * 0.3) };
    const o = textCv.getContext("2d")                            ;
    o.setTransform(dpr, 0, 0, dpr, 0, 0); o.clearRect(0, 0, W, H);
    o.font = `500 ${fs}px ${FONT_STACK}`; o.textAlign = "center"; o.textBaseline = "middle";
    const m = o.measureText(text);
    const tx = W / 2 - (m.actualBoundingBoxRight - m.actualBoundingBoxLeft) / 2;
    o.fillStyle = `rgba(${pal.ink.join(",")},.95)`; o.fillText(text, tx, ty);
    const tw = m.width;
    const X0 = Math.max(0, Math.floor((tx - tw / 2 - 6) * dpr)), X1 = Math.min(cv.width, Math.ceil((tx + tw / 2 + 6) * dpr));
    const Y0 = Math.max(0, Math.floor((ty - fs) * dpr)), Y1 = Math.min(cv.height, Math.ceil((ty + fs) * dpr));
    const d = o.getImageData(0, 0, cv.width, cv.height).data;
    let cs = Math.max(2, Math.round(3 * dpr));
    let pts            ;
    for (;;) {
      pts = [];
      for (let y = Y0; y < Y1; y += cs) for (let x = X0; x < X1; x += cs) {
        const w = Math.min(cs, cv.width - x), h = Math.min(cs, cv.height - y);
        let hit = false;
        for (let yy = y; yy < y + h && !hit; yy++) for (let xx = x; xx < x + w; xx++) if (d[(yy * cv.width + xx) * 4 + 3] > 0) { hit = true; break; }
        if (hit) pts.push([x, y, w, h]);
      }
      if (pts.length <= 2400) break;
      cs++;
    }
    let minX = 1e9, maxX = -1e9;
    for (const p of pts) {
      p[4] = (p[0] + p[2] / 2) / dpr; p[5] = (p[1] + p[3] / 2) / dpr;
      if (p[4] < minX) minX = p[4];
      if (p[4] > maxX) maxX = p[4];
    }
    const r = createRng(7);
    parts = pts.map((p) => {
      const u = r(), size = u < 0.62 ? 0.9 + r() * 0.8 : u < 0.9 ? 1.8 + r() * 1.4 : 3.4 + r() * 3.2;
      return {
        rx: p[0], ry: p[1], rw: p[2], rh: p[3], hx: p[4], hy: p[5], nx: (p[4] - minX) / Math.max(1, maxX - minX),
        ny: (p[5] - (ty - fs / 2)) / fs, r1: r(), r2: r(), r3: r(), size, fx: 0, fy: 0, fc: [0, 0, 0]       , lt: 0, bend: 0, pa: 0,
      };
    });
    ctx .setTransform(dpr, 0, 0, dpr, 0, 0);
    reroll();
  }

  function drawRealText() {
    const c = ctx                            ;
    c.setTransform(1, 0, 0, 1, 0, 0); c.clearRect(0, 0, cv.width, cv.height);
    c.globalAlpha = 1; c.drawImage(textCv, 0, 0); c.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function frame(now        ) {
    raf = 0;
    const c = ctx                            ;
    const lead = intro && phase === "gathering" ? INTRO_LEAD : 0;
    const prog = clamp((now - phaseStart) / TIMING.travel + lead), out = phase === "dissolving";
    c.setTransform(1, 0, 0, 1, 0, 0); c.clearRect(0, 0, cv.width, cv.height);
    for (const p of parts) {
      const pl = plan(mode, p, W, H), lt = clamp((prog - pl.delay * 0.55) / 0.45);
      p.lt = lt; p.bend = pl.bend;
      p.pa = out ? 1 - smooth(lt / 0.18) : smooth((lt - 0.82) / 0.18);
      if (p.pa <= 0.002) continue;
      c.globalAlpha = p.pa; c.drawImage(textCv, p.rx, p.ry, p.rw, p.rh, p.rx, p.ry, p.rw, p.rh);
    }
    c.setTransform(dpr, 0, 0, dpr, 0, 0);
    for (const p of parts) {
      const lt = p.lt;
      if (lt <= 0 || lt >= 1) continue;
      const a                   = out ? [p.hx, p.hy] : [p.fx, p.fy];
      const b                   = out ? [p.fx, p.fy] : [p.hx, p.hy];
      const q = bowAt(a, b, out ? p.bend : -p.bend, lt), e = out ? q[2] : 1 - q[2];
      let alpha = 0.1 + 0.9 * (1 - smooth((e - 0.45) / 0.55));
      alpha *= out ? 1 - smooth((lt - 0.85) / 0.15) : smooth(lt / 0.15) * (1 - p.pa);
      if (alpha <= 0.004) continue;
      c.globalAlpha = Math.min(1, alpha); c.fillStyle = rgbStr(pal.ink, p.fc, smooth(e / 0.6));
      c.beginPath(); c.arc(q[0], q[1], (p.size * mix(1, 1.7, smooth(e))) / 2, 0, 6.2832); c.fill();
    }
    c.globalAlpha = 1;
    if (prog < 1) raf = requestAnimationFrame(frame); else advance();
  }

  function stopWork() { clearTimeout(timer); cancelAnimationFrame(raf); raf = 0; }

  function enter(next       ) {
    phase = next; phaseStart = performance.now(); stopWork();
    if (!active || destroyed) return;
    if (next === "text") { intro = false; drawRealText(); /* The title settles permanently after the entrance. */ }
    else if (next === "field") {
      ctx .setTransform(1, 0, 0, 1, 0, 0); ctx .clearRect(0, 0, cv.width, cv.height); ctx .setTransform(dpr, 0, 0, dpr, 0, 0);
      timer = window.setTimeout(advance, TIMING.field);
    } else {
      if (next === "dissolving") { mode = nextMode(); reroll(); }
      frame(performance.now());
    }
  }
  function advance() {
    enter(phase === "text" ? "dissolving" : phase === "dissolving" ? "field" : phase === "field" ? "gathering" : "text");
  }

  build();
  enter("gathering");
  return {
    setActive(on) {
      if (on === active || destroyed) return;
      active = on;
      if (on) enter(phase); else stopWork();
    },
    resize() {
      if (destroyed) return;
      stopWork(); build();
      if (active) enter(phase); else if (phase === "text") drawRealText();
    },
    destroy() { destroyed = true; active = false; stopWork(); },
  };
}


function mountParticle(canvas                  ,text       ){const engine=createEngine(canvas,text,DARK);return engine;}

window.KienScenes.particle=mountParticle;})();
