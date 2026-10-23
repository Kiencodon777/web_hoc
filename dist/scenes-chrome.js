/* Adapted from supplied Holo Chrome Flow reference. */
window.KienScenes=window.KienScenes||{};
(()=>{
                                
                                                                              
              
                                           
               
                                    
              
                                                              
               
               
               
 

const HOLO_CHROME_PRESETS = {
  opal: {
    base: "#b7b9cf",
    shine: "#fff4e4",
    vein: "#07070e",
    filmA: "#ff6fd8",
    filmB: "#59e8ff",
    filmC: "#ffc896",
  },
  noir: {
    base: "#34353f",
    shine: "#f2f0ff",
    vein: "#000000",
    filmA: "#c04dff",
    filmB: "#2de2c4",
    filmC: "#ff9a3c",
  },
  "rose-gold": {
    base: "#d8b6aa",
    shine: "#fff1df",
    vein: "#1c0a0d",
    filmA: "#ff8fb1",
    filmB: "#ffd68a",
    filmC: "#b58dff",
  },
  glacier: {
    base: "#a8c4d6",
    shine: "#f4fbff",
    vein: "#020a12",
    filmA: "#6ff4ff",
    filmB: "#9b86ff",
    filmC: "#e9fffa",
  },
  aurora: {
    base: "#9aa3b6",
    shine: "#effff8",
    vein: "#030611",
    filmA: "#3dffb0",
    filmB: "#7a5cff",
    filmC: "#ff5ec4",
  },
}                                           

                                                               

                                   
     
                                                                         
                                                                        
                                     
     
                 
                                                                          
                           
                                                            
                                    
                                                                            
                
                                                                                  
               
                                                                     
                
                                                                          
                  
                                                          
                
                                                             
                      
                                                                       
                 
                                                            
                
                                                 
                  
                                                                 
               
                                                               
                
                                          
                
                             
                   
                                                            
               
                                                                               
                       
                                                                
                   
                                                                                     
                 
                                                                         
                            
                    
 

// #region color
function hexToRgb(hex        ) {
  let h = String(hex).trim().replace(/^#/, "")
  if (h.length === 3 || h.length === 4) {
    h = h
      .slice(0, 3)
      .split("")
      .map((c) => c + c)
      .join("")
  } else if (h.length === 8) {
    h = h.slice(0, 6)
  }
  if (!/^[0-9a-f]{6}$/i.test(h)) return [0, 0, 0]
  const n = parseInt(h, 16)
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255]
}

// Hex that goes into a CSS string must be well-formed, or the fallback
// gradient silently drops the whole declaration.
function cssHex(hex        , fallback        ) {
  const h = String(hex).trim()
  return /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(h) ? h : fallback
}
// #endregion

const MAX_RIPPLES = 6
const RIPPLE_LIFE = 4

// One triangle that covers the viewport, built from gl_VertexID — no buffers.
const VERT = `#version 300 es
void main() {
  vec2 p = vec2(float((gl_VertexID << 1) & 2), float(gl_VertexID & 2));
  gl_Position = vec4(p * 2.0 - 1.0, 0.0, 1.0);
}
`

const FRAG = `#version 300 es
precision highp float;

uniform vec2 uRes;
uniform float uTime;
uniform vec2 uMouse;        // centred, y up, in units of the canvas height
uniform float uHover;       // 0 idle drift, 1 pointer inside
uniform vec2 uDrag;         // smoothed pointer velocity
uniform vec3 uBase;
uniform vec3 uShine;
uniform vec3 uVein;
uniform vec3 uFilmA;
uniform vec3 uFilmB;
uniform vec3 uFilmC;
uniform float uFlow;
uniform float uScale;
uniform float uStretch;
uniform float uAngle;
uniform float uIrid;
uniform float uRidges;
uniform float uVeins;
uniform float uSparkle;
uniform float uTilt;
uniform float uSmear;
uniform float uGrain;
uniform float uVignette;
uniform float uSeed;
uniform vec4 uRipples[6];   // xy centre, z start time, w strength

out vec4 outColor;

float hash21(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * f * (f * (f * 6.0 - 15.0) + 10.0);
  return mix(
    mix(hash21(i), hash21(i + vec2(1.0, 0.0)), u.x),
    mix(hash21(i + vec2(0.0, 1.0)), hash21(i + vec2(1.0, 1.0)), u.x),
    u.y
  );
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  mat2 rot = mat2(1.6, 1.2, -1.2, 1.6);
  for (int i = 0; i < 4; i++) {
    v += a * noise(p);
    p = rot * p;
    a *= 0.5;
  }
  return v;
}

// The metal. Warp the plane by fbm, warp it again by the result, and read fbm
// once more through both — the classic way to get folds that look poured.
// Returns height in x and the second warp's magnitude in y, which is where the
// folds pinch and the veins open.
vec2 surface(vec2 p, float t) {
  vec2 q = vec2(
    fbm(p + vec2(0.0, 0.0) + vec2(0.11, 0.04) * t),
    fbm(p + vec2(5.2, 1.3) - vec2(0.03, 0.09) * t)
  );
  vec2 r = vec2(
    fbm(p + 3.2 * uFlow * q + vec2(1.7, 9.2) + 0.13 * t),
    fbm(p + 3.2 * uFlow * q + vec2(8.3, 2.8) - 0.10 * t)
  );
  float f = fbm(p + 3.0 * uFlow * r);
  return vec2(f, length(r - q));
}

float height(vec2 p, float t, out float pinch) {
  vec2 s = surface(p, t);
  pinch = s.y;
  // Fine ridges along the contour lines: the layered, poured look.
  return s.x + 0.016 * uRidges * sin(s.x * 70.0);
}

// Three stops, cycled smoothly: A -> B -> C -> A.
vec3 film(float x) {
  x = fract(x) * 3.0;
  vec3 a = mix(uFilmA, uFilmB, smoothstep(0.0, 1.0, x));
  vec3 b = mix(uFilmB, uFilmC, smoothstep(1.0, 2.0, x));
  vec3 c = mix(uFilmC, uFilmA, smoothstep(2.0, 3.0, x));
  return x < 1.0 ? a : (x < 2.0 ? b : c);
}

void main() {
  vec2 uv = (gl_FragCoord.xy - 0.5 * uRes) / uRes.y;
  float t = uTime;
  vec2 m = uMouse;

  // Comb the plane in one direction so the folds stream like the pour.
  float ca = cos(uAngle);
  float sa = sin(uAngle);
  mat2 comb = mat2(ca, sa, -sa, ca);

  vec2 p = uv;

  // Smear: drag the metal along with the pointer, and twist it a little.
  vec2 d = p - m;
  float fall = exp(-dot(d, d) * 7.0);
  p -= uDrag * fall * 0.22 * uSmear;
  float tw = uSmear * (0.25 * uHover + length(uDrag) * 0.6) * fall;
  float cs = cos(tw);
  float sn = sin(tw);
  p = m + mat2(cs, -sn, sn, cs) * (p - m);

  // Beads of mercury: a damped ring that pushes the metal radially as it passes.
  float ring = 0.0;
  for (int i = 0; i < 6; i++) {
    vec4 rp = uRipples[i];
    float age = t - rp.z;
    if (rp.w <= 0.0 || age < 0.0 || age > 4.0) continue;
    vec2 dd = uv - rp.xy;
    float rr = length(dd);
    float x = rr - age * 0.38;
    float env = exp(-x * x * 50.0) * exp(-age * 1.1) * rp.w;
    p += (dd / max(rr, 1e-3)) * sin(x * 36.0) * env * 0.05;
    ring += env * (0.5 + 0.5 * sin(x * 36.0));
  }

  vec2 q = comb * p;
  q.x /= max(uStretch, 0.2);
  float freq = 1.85 * uScale;
  q = q * freq + vec2(uSeed * 7.31, uSeed * 3.17);

  // Height and its gradient, by finite differences a pixel and a half apart.
  float e = 1.5 / uRes.y * freq;
  float pinch;
  float pinchDummy;
  float h = height(q, t, pinch);
  float hx = height(q + vec2(e, 0.0), t, pinchDummy);
  float hy = height(q + vec2(0.0, e), t, pinchDummy);
  vec2 g = vec2(hx - h, hy - h) / e;
  float slope = length(g);
  // Back into screen space so the light is not combed along with the folds.
  g.x /= max(uStretch, 0.2);
  g = transpose(comb) * g;
  vec3 n = normalize(vec3(-g * 0.08, 1.0));

  // The pointer tilts the foil: the light swings and the film slides.
  // Clamped, so a pointer in a far corner of a wide canvas tilts the foil
  // rather than turning the key light straight into the camera.
  vec2 tiltv = m * uTilt;
  tiltv *= min(1.0, 0.45 / max(length(tiltv), 1e-4));
  vec3 V = vec3(0.0, 0.0, 1.0);
  vec3 R = reflect(-V, n);
  float fres = pow(1.0 - n.z, 1.2);

  // A soft studio: dim below, bright above, a long softbox and a warm key.
  // The tilt swings the lights around the axis rather than raising them, so
  // the highlights travel across the folds while the exposure stays put.
  float az = 2.16 + tiltv.x * 2.2 - tiltv.y * 1.2;
  vec3 L = normalize(vec3(cos(az) * 0.56, sin(az) * 0.56, 0.8));
  vec3 L2 = normalize(vec3(-cos(az + 0.4) * 0.72, -sin(az + 0.4) * 0.72, 0.7));
  float sky = smoothstep(-0.6, 0.8, R.y + tiltv.y * 0.25 + 0.2 * R.x);
  // Squared, so slopes turned away from the light fall into cool shadow.
  vec3 chrome = uBase * (0.34 + 1.08 * pow(sky, 1.5));
  float strip = exp(-pow((dot(R.xy, vec2(0.7, 0.7)) - 0.3 - 0.25 * (tiltv.x + tiltv.y)) * 4.0, 2.0));
  chrome += uBase * strip * 0.3;
  float kd = max(dot(R, L), 0.0);
  float key = pow(kd, 22.0);
  float keyWide = pow(kd, 5.0);
  float rim = pow(max(dot(R, L2), 0.0), 8.0);

  // Thin film: hue walks with the viewing angle, the height, and the tilt.
  float phase = fres * 2.2 + h * 3.0 + dot(n.xy, tiltv) * 2.5 + t * 0.03 + uSeed * 0.37;
  vec3 holo = film(phase);
  float lum = dot(chrome, vec3(0.299, 0.587, 0.114));
  // The film rides the slopes and the bright side; flat, dim metal stays silver.
  float iridMask = clamp(smoothstep(0.12, 0.6, fres) * (0.25 + 0.75 * sky) + keyWide * 0.9, 0.0, 1.0) * uIrid;
  // Pushed past the palette a touch, so the film reads as colour, not tint.
  vec3 vivid = clamp(mix(vec3(dot(holo, vec3(0.333))), holo, 1.35), 0.0, 1.0);
  vec3 col = mix(chrome, chrome * 0.35 + vivid * (0.28 + lum), clamp(iridMask * 0.9, 0.0, 1.0));

  // Highlights: warm key, film-tinted rim, and a soft warm pool of light that
  // drifts with the tilt — the glow at the heart of the pour.
  col += uShine * key * 1.1;
  col += mix(uShine, holo, 0.5) * keyWide * 0.25;
  col += holo * rim * 0.5 * uIrid;
  // Spectral fringe: a fast rainbow around the rim of each hot highlight, the
  // way a hologram splits white light at the edge of a reflection.
  float kf = pow(kd, 12.0);
  float fringe = smoothstep(0.2, 0.45, kf) * (1.0-smoothstep(0.5,0.85,kf));
  vec3 split = clamp(mix(vec3(0.5), film(kf * 2.4 + h * 1.5 + dot(n.xy, tiltv) * 3.0), 1.5), 0.0, 1.0);
  col += (split - 0.35) * fringe * 0.45 * uIrid;
  vec2 hot = uv - tiltv * 0.55;
  col += mix(uShine, uFilmC, 0.35) * exp(-dot(hot, hot) * 2.2) * 0.22 * (0.5 + sky);

  // Veins: where the folds dip lowest the metal opens into dark channels; where
  // the second warp pinches, a thin seam runs along the fold.
  // Veins: a narrow band along the low contour, so the dark reads as gaps
  // between folds rather than holes; plus a thin seam where the second warp
  // pinches. Below the band the metal carries on as a deeper fold.
  float lo = 0.3;
  // Distance to the contour in pattern space, so a vein keeps its width
  // whether the fold is steep or shallow.
  float vd = abs(h - lo) / (slope + 0.25);
  // Tapered by a slow noise so veins swell and pinch out like real seams.
  float vw = (0.003 + 0.04 * uVeins) * (0.25 + 1.1 * noise(q * 0.45 + 11.0));
  float veinLow = (1.0-smoothstep(vw * 0.3,vw,vd));
  float seam = (1.0-smoothstep(0.0,0.004 + 0.02 * uVeins,abs(pinch-0.3))) * (1.0-smoothstep(0.32,0.55,h));
  float vein = clamp(max(veinLow, seam * 0.9) * step(0.001, uVeins), 0.0, 1.0);
  // The lip of each vein catches a hairline of light.
  float lip = smoothstep(0.0, 0.5, vein) * (1.0-smoothstep(0.5,1.0,vein));
  col = mix(col, uVein + holo * 0.035, vein);
  col += mix(uShine, holo, 0.6) * lip * 0.25 * (0.35 + keyWide);

  // Sparkles: a scatter of points, brighter and denser in the dark.
  vec2 sg = gl_FragCoord.xy / uRes.y * 140.0;
  vec2 cell = floor(sg);
  float rnd = hash21(cell + uSeed * 13.1);
  vec2 off = vec2(hash21(cell + 7.7), hash21(cell + 3.3)) * 0.6 + 0.2;
  vec2 dp = fract(sg) - off;
  float tw2 = 0.5 + 0.5 * sin(t * (2.0 + rnd * 5.0) + rnd * 40.0);
  float star = (1.0-smoothstep(0.0,0.11,length(dp))) + 0.35 * (1.0-smoothstep(0.0,0.03,abs(dp.x)*abs(dp.y)*30.0)) * (1.0-smoothstep(0.0,0.45,length(dp)));
  float density = mix(0.985, 0.93, vein);
  col += mix(uShine, holo, 0.4) * star * step(density, rnd) * tw2 * uSparkle * mix(0.6, 1.6, vein);

  // Mercury rings catch the light on their crests.
  col += (uShine * 0.25 + holo * 0.15) * ring;

  // The light that sits under the pointer, as if the foil were catching it.
  float dist = length(uv - m);
  col += mix(uShine, holo, 0.35) * (0.06 / (dist + 0.18)) * 0.25 * uHover * (1.0 - vein * 0.7);

  float vig = (1.0-smoothstep(0.2,1.35,length(uv * vec2(0.8, 1.0))));
  col *= mix(1.0, vig, uVignette);

  // Gentle shoulder so the highlights bloom instead of clipping flat.
  col = col / (1.0 + max(col - 1.0, 0.0) * 0.6);

  float gr = hash21(gl_FragCoord.xy + fract(t * 7.13) * vec2(97.3, 41.7));
  col += (gr - 0.5) * 0.05 * uGrain;
  col += (hash21(gl_FragCoord.yx + 13.7) - 0.5) / 255.0;

  outColor = vec4(clamp(col, 0.0, 1.0), 1.0);
}
`

function compile(gl                        , vert        , frag        ) {
  const program = gl.createProgram()
  if (!program) return null
  for (const [type, source] of [
    [gl.VERTEX_SHADER, vert],
    [gl.FRAGMENT_SHADER, frag],
  ]         ) {
    const shader = gl.createShader(type)
    if (!shader) return null
    gl.shaderSource(shader, source)
    gl.compileShader(shader)
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error("holo-chrome-flow:", gl.getShaderInfoLog(shader))
      return null
    }
    gl.attachShader(program, shader)
    gl.deleteShader(shader)
  }
  gl.linkProgram(program)
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error("holo-chrome-flow:", gl.getProgramInfoLog(program))
    return null
  }
  return program
}



function mountChrome(root,canvas,settings={}){
 const gl=canvas.getContext('webgl2',{alpha:false,antialias:false,depth:false,powerPreference:'low-power'});if(!gl)return()=>{};
 const program=compile(gl,VERT,FRAG);if(!program)return()=>{};const vao=gl.createVertexArray();let raf=0,last=0,t=9,destroyed=false;
 const palette=HOLO_CHROME_PRESETS.noir,mouse={x:0,y:0},ripples=new Float32Array(24);let slot=0;
 const loc=Object.fromEntries(['uRes','uTime','uMouse','uHover','uDrag','uBase','uShine','uVein','uFilmA','uFilmB','uFilmC','uFlow','uScale','uStretch','uAngle','uIrid','uRidges','uVeins','uSparkle','uTilt','uSmear','uGrain','uVignette','uSeed','uRipples'].map(n=>[n,gl.getUniformLocation(program,n)]));
 function draw(now){raf=0;if(destroyed||document.hidden)return;if(settings.motion&&last&&now-last<40){raf=requestAnimationFrame(draw);return;}let dt=last?Math.min((now-last)/1000,.08):0;last=now;if(settings.motion)t+=dt*.25;const dpr=Math.min(devicePixelRatio||1,1.15);const w=Math.round(root.clientWidth*dpr),h=Math.round(root.clientHeight*dpr);if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h;}gl.viewport(0,0,w,h);gl.useProgram(program);gl.bindVertexArray(vao);gl.uniform2f(loc.uRes,w,h);gl.uniform1f(loc.uTime,t);gl.uniform2f(loc.uMouse,mouse.x,mouse.y);gl.uniform1f(loc.uHover,0.35);gl.uniform2f(loc.uDrag,0,0);for(const [n,c]of Object.entries({uBase:palette.base,uShine:palette.shine,uVein:palette.vein,uFilmA:palette.filmA,uFilmB:palette.filmB,uFilmC:palette.filmC}))gl.uniform3fv(loc[n],hexToRgb(c));for(const [n,v]of Object.entries({uFlow:.65,uScale:1.2,uStretch:2.2,uAngle:.6,uIrid:.6,uRidges:.6,uVeins:.28,uSparkle:.15,uTilt:.4,uSmear:0,uGrain:.15,uVignette:.6,uSeed:3}))gl.uniform1f(loc[n],v);gl.uniform4fv(loc.uRipples,ripples);gl.drawArrays(gl.TRIANGLES,0,3);if(settings.motion)raf=requestAnimationFrame(draw);}
 function kick(){if(!raf&&!document.hidden&&!destroyed)raf=requestAnimationFrame(draw);}
 const move=e=>{mouse.x=(e.clientX-root.clientWidth/2)/root.clientHeight;mouse.y=-(e.clientY-root.clientHeight/2)/root.clientHeight;if(settings.motion)kick();};
 const visibility=()=>{cancelAnimationFrame(raf);raf=0;last=0;if(!document.hidden)kick();};const ro=new ResizeObserver(kick);ro.observe(root);document.addEventListener('visibilitychange',visibility);window.addEventListener('pointermove',move,{passive:true});kick();
 return()=>{destroyed=true;cancelAnimationFrame(raf);ro.disconnect();document.removeEventListener('visibilitychange',visibility);window.removeEventListener('pointermove',move);gl.deleteVertexArray(vao);gl.deleteProgram(program);};
}

window.KienScenes.chrome=mountChrome;})();
