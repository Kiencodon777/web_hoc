'use strict';
/* Adapted from archisvaze/liquid-glass, fbeb99e.
MIT License

Copyright (c) 2026 Archis Vaze

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

*/
(()=>{
        const SURFACE_FNS = {
            convex_squircle: (x) => Math.pow(1 - Math.pow(1 - x, 4), 0.25),
            convex_circle: (x) => Math.sqrt(1 - (1 - x) * (1 - x)),
            concave: (x) => 1 - Math.sqrt(1 - (1 - x) * (1 - x)),
            lip: (x) => {
                const convex = Math.pow(1 - Math.pow(1 - Math.min(x * 2, 1), 4), 0.25);
                const concave = 1 - Math.sqrt(1 - (1 - x) * (1 - x)) + 0.1;
                const t = 6 * x ** 5 - 15 * x ** 4 + 10 * x ** 3;
                return convex * (1 - t) + concave * t;
            },
        };

        function calculateRefractionProfile(glassThickness, bezelWidth, heightFn, ior, samples) {
            samples = samples || 128;
            const eta = 1 / ior;
            function refract(nx, ny) {
                const dot = ny;
                const k = 1 - eta * eta * (1 - dot * dot);
                if (k < 0) return null;
                const sq = Math.sqrt(k);
                return [-(eta * dot + sq) * nx, eta - (eta * dot + sq) * ny];
            }
            const profile = new Float64Array(samples);
            for (let i = 0; i < samples; i++) {
                const x = i / samples;
                const y = heightFn(x);
                const dx = x < 1 ? 0.0001 : -0.0001;
                const y2 = heightFn(x + dx);
                const deriv = (y2 - y) / dx;
                const mag = Math.sqrt(deriv * deriv + 1);
                const ref = refract(-deriv / mag, -1 / mag);
                if (!ref) {
                    profile[i] = 0;
                    continue;
                }
                profile[i] = ref[0] * ((y * bezelWidth + glassThickness) / ref[1]);
            }
            return profile;
        }

        function generateDisplacementMap(w, h, radius, bezelWidth, profile, maxDisp) {
            const c = document.createElement('canvas');
            c.width = w;
            c.height = h;
            const ctx = c.getContext('2d');
            const img = ctx.createImageData(w, h);
            const d = img.data;
            for (let i = 0; i < d.length; i += 4) {
                d[i] = 128;
                d[i + 1] = 128;
                d[i + 2] = 0;
                d[i + 3] = 255;
            }

            const r = radius,
                rSq = r * r,
                r1Sq = (r + 1) ** 2;
            const rBSq = Math.max(r - bezelWidth, 0) ** 2;
            const wB = w - r * 2,
                hB = h - r * 2,
                S = profile.length;

            for (let y1 = 0; y1 < h; y1++) {
                for (let x1 = 0; x1 < w; x1++) {
                    const x = x1 < r ? x1 - r : x1 >= w - r ? x1 - r - wB : 0;
                    const y = y1 < r ? y1 - r : y1 >= h - r ? y1 - r - hB : 0;
                    const dSq = x * x + y * y;
                    if (dSq > r1Sq || dSq < rBSq) continue;
                    const dist = Math.sqrt(dSq);
                    const fromSide = r - dist;
                    const op = dSq < rSq ? 1 : 1 - (dist - Math.sqrt(rSq)) / (Math.sqrt(r1Sq) - Math.sqrt(rSq));
                    if (op <= 0 || dist === 0) continue;
                    const cos = x / dist,
                        sin = y / dist;
                    const bi = Math.min(((fromSide / bezelWidth) * S) | 0, S - 1);
                    const disp = profile[bi] || 0;
                    const dX = (-cos * disp) / maxDisp,
                        dY = (-sin * disp) / maxDisp;
                    const idx = (y1 * w + x1) * 4;
                    d[idx] = (128 + dX * 127 * op + 0.5) | 0;
                    d[idx + 1] = (128 + dY * 127 * op + 0.5) | 0;
                }
            }
            ctx.putImageData(img, 0, 0);
            return c.toDataURL();
        }

        function generateSpecularMap(w, h, radius, bezelWidth, angle) {
            angle = angle != null ? angle : Math.PI / 3;
            const c = document.createElement('canvas');
            c.width = w;
            c.height = h;
            const ctx = c.getContext('2d');
            const img = ctx.createImageData(w, h);
            const d = img.data;
            d.fill(0);

            const r = radius,
                rSq = r * r,
                r1Sq = (r + 1) ** 2;
            const rBSq = Math.max(r - bezelWidth, 0) ** 2;
            const wB = w - r * 2,
                hB = h - r * 2;
            const sv = [Math.cos(angle), Math.sin(angle)];

            for (let y1 = 0; y1 < h; y1++) {
                for (let x1 = 0; x1 < w; x1++) {
                    const x = x1 < r ? x1 - r : x1 >= w - r ? x1 - r - wB : 0;
                    const y = y1 < r ? y1 - r : y1 >= h - r ? y1 - r - hB : 0;
                    const dSq = x * x + y * y;
                    if (dSq > r1Sq || dSq < rBSq) continue;
                    const dist = Math.sqrt(dSq);
                    const fromSide = r - dist;
                    const op = dSq < rSq ? 1 : 1 - (dist - Math.sqrt(rSq)) / (Math.sqrt(r1Sq) - Math.sqrt(rSq));
                    if (op <= 0 || dist === 0) continue;
                    const cos = x / dist,
                        sin = -y / dist;
                    const dot = Math.abs(cos * sv[0] + sin * sv[1]);
                    const edge = Math.sqrt(Math.max(0, 1 - (1 - fromSide) ** 2));
                    const coeff = dot * edge;
                    const col = (255 * coeff) | 0;
                    const alpha = (col * coeff * op) | 0;
                    const idx = (y1 * w + x1) * 4;
                    d[idx] = col;
                    d[idx + 1] = col;
                    d[idx + 2] = col;
                    d[idx + 3] = alpha;
                }
            }
            ctx.putImageData(img, 0, 0);
            return c.toDataURL();
        }


 const ns='http://www.w3.org/2000/svg', entries=new Map();let defs,serial=0,raf=0;
 const supported=/Chrome|Chromium|Edg\//.test(navigator.userAgent)&&!navigator.userAgent.includes('Firefox');
 function ensure(){if(defs)return;const svg=document.createElementNS(ns,'svg');svg.setAttribute('width','0');svg.setAttribute('height','0');svg.setAttribute('aria-hidden','true');svg.style.cssText='position:absolute;overflow:hidden;pointer-events:none';defs=document.createElementNS(ns,'defs');svg.append(defs);document.body.append(svg);document.documentElement.dataset.glassEngine=supported?'svg-refraction':'frosted-fallback';}
 function build(el,entry){if(!el.isConnected||!el.offsetWidth||!el.offsetHeight)return;const w=Math.round(el.offsetWidth),h=Math.round(el.offsetHeight),radius=Math.min(parseFloat(getComputedStyle(el).borderRadius)||18,w/2,h/2),sig=[w,h,radius].join(':');if(sig===entry.sig)return;entry.sig=sig;if(!supported)return;
  // Maps are sampled at a bounded resolution, then stretched to logical element dimensions.
  const factor=Math.min(1,540/Math.max(w,h)),mw=Math.max(2,Math.round(w*factor)),mh=Math.max(2,Math.round(h*factor)),r=Math.max(2,radius*factor),bezel=Math.max(1,Math.min(12*factor,r-1));
  try{const profile=calculateRefractionProfile(14*factor,bezel,SURFACE_FNS.convex_squircle,1.45,128),max=Math.max(...profile.map(Math.abs))||1,displacement=generateDisplacementMap(mw,mh,r,bezel,profile,max),specular=generateSpecularMap(mw,mh,r,bezel*2.5);
   const filter=document.createElementNS(ns,'filter');filter.id=entry.id;filter.setAttribute('x','0%');filter.setAttribute('y','0%');filter.setAttribute('width','100%');filter.setAttribute('height','100%');filter.setAttribute('color-interpolation-filters','sRGB');
   filter.innerHTML='<feGaussianBlur in="SourceGraphic" stdDeviation="2.8" result="blurred"/><feImage href="'+displacement+'" x="0" y="0" width="'+w+'" height="'+h+'" preserveAspectRatio="none" result="map"/><feDisplacementMap in="blurred" in2="map" scale="'+(max/factor*.35).toFixed(3)+'" xChannelSelector="R" yChannelSelector="G" result="refracted"/><feColorMatrix in="refracted" type="saturate" values="1.5" result="vibrant"/><feImage href="'+specular+'" width="'+w+'" height="'+h+'" preserveAspectRatio="none" result="spec"/><feComponentTransfer in="spec" result="shine"><feFuncA type="linear" slope="0.24"/></feComponentTransfer><feBlend in="shine" in2="vibrant" mode="screen"/>';
   if(entry.filter)entry.filter.replaceWith(filter);else defs.append(filter);entry.filter=filter;el.style.setProperty('--lg-optics','url(#'+entry.id+')');
  }catch{el.style.removeProperty('--lg-optics');}
 }
 function flush(){raf=0;for(const [el,e] of entries){if(!el.isConnected){e.observer.disconnect();e.filter?.remove();entries.delete(el);}else build(el,e);}}
 function schedule(){if(!raf)raf=requestAnimationFrame(flush);}
 function refresh(){ensure();for(const el of document.querySelectorAll('.sidebar,.dock-indicator,.subject-picker-trigger,.subject-picker-panel,.glass-calendar')){el.classList.add('lg-material');if(entries.has(el))continue;const entry={id:'kh-optics-'+(++serial),sig:'',filter:null};entry.observer=new ResizeObserver(schedule);entries.set(el,entry);entry.observer.observe(el);}schedule();}
 window.KienGlass={refresh};
})();
