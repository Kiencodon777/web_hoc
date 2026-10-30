'use strict';
// Contour shader adapted from the user-supplied topography.txt.
(()=>{
const RANGE=.95,HILL_RADIUS=90,RIPPLE_WIDTH=60;
const PERMUTATION = (() => {
  const table = Array.from({ length: 256 }, (_, i) => i);
  let seed = 1013;
  for (let i = 255; i > 0; i--) {
    seed = seed * 16807 % 2147483647;
    const j = seed % (i + 1);
    [table[i], table[j]] = [table[j], table[i]];
  }
  return Uint8Array.from([...table, ...table]);
})();
const VERTEX = `
attribute vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`;
const FRAGMENT = `
#extension GL_OES_standard_derivatives : enable
precision highp float;
uniform sampler2D permutation;
uniform vec2 size;
uniform float dpr;
uniform float feature;
uniform float z;
uniform float step;
uniform float range;
uniform float amount;
uniform float lift;
uniform float hillRadius;
uniform vec2 hill;
uniform vec4 ripples[4];
uniform float reach;
uniform float rippleWidth;
uniform vec3 color;

float perm(float i) {
  return floor(texture2D(permutation, vec2((mod(i, 256.0) + 0.5) / 256.0, 0.5)).r * 255.0 + 0.5);
}

float fade(float t) {
  return t * t * t * (t * (t * 6.0 - 15.0) + 10.0);
}

float grad(float hash, float x, float y, float z) {
  float h = mod(hash, 16.0);
  float u = h < 8.0 ? x : y;
  float v = h < 4.0 ? y : (h == 12.0 || h == 14.0 ? x : z);
  return (mod(h, 2.0) == 0.0 ? u : -u) + (mod(floor(h / 2.0), 2.0) == 0.0 ? v : -v);
}

float noise(vec3 p) {
  vec3 cell = mod(floor(p), 256.0);
  vec3 f = p - floor(p);
  float u = fade(f.x);
  float v = fade(f.y);
  float w = fade(f.z);
  float A = perm(cell.x) + cell.y;
  float AA = perm(A) + cell.z;
  float AB = perm(A + 1.0) + cell.z;
  float B = perm(cell.x + 1.0) + cell.y;
  float BA = perm(B) + cell.z;
  float BB = perm(B + 1.0) + cell.z;
  return mix(
    mix(
      mix(grad(perm(AA), f.x, f.y, f.z), grad(perm(BA), f.x - 1.0, f.y, f.z), u),
      mix(grad(perm(AB), f.x, f.y - 1.0, f.z), grad(perm(BB), f.x - 1.0, f.y - 1.0, f.z), u),
      v
    ),
    mix(
      mix(grad(perm(AA + 1.0), f.x, f.y, f.z - 1.0), grad(perm(BA + 1.0), f.x - 1.0, f.y, f.z - 1.0), u),
      mix(grad(perm(AB + 1.0), f.x, f.y - 1.0, f.z - 1.0), grad(perm(BB + 1.0), f.x - 1.0, f.y - 1.0, f.z - 1.0), u),
      v
    ),
    w
  );
}

void main() {
  vec2 point = vec2(gl_FragCoord.x, size.y - gl_FragCoord.y) / dpr;
  vec2 n = point / feature;
  float value = noise(vec3(n, z)) * 1.1 + noise(vec3(n * 2.1, z * 1.7)) * 0.45;
  if (lift > 0.0) value += lift * exp(-length(point - hill) / hillRadius);
  for (int i = 0; i < 4; i++) {
    vec4 ripple = ripples[i];
    if (ripple.w > 0.5) {
      float d = length(point - ripple.xy) - ripple.z * reach;
      value += 0.9 * (1.0 - ripple.z) * cos(d / rippleWidth * 1.8) * exp(-(d * d) / (2.0 * rippleWidth * rippleWidth));
    }
  }
  value *= amount;
  float level = (value + range) / step;
  float nearest = floor(level + 0.5);
  float slope = length(vec2(dFdx(level), dFdy(level)));
  float pixels = abs(level - nearest) / max(slope, 1e-6);
  bool major = mod(nearest, 5.0) == 0.0;
  float width = (major ? 1.5 : 1.0) * dpr;
  float alpha = slope > 1e-6 ? clamp(width * 0.5 + 0.5 - pixels, 0.0, 1.0) * (major ? 0.85 : 0.4) : 0.0;
  gl_FragColor = vec4(color * alpha, alpha);
}
`;
function compile(gl, type, source) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  return gl.getShaderParameter(shader, gl.COMPILE_STATUS) ? shader : null;
}
function createGlRenderer(gl) {
  if (!gl.getExtension("OES_standard_derivatives")) return null;
  const vertex = compile(gl, gl.VERTEX_SHADER, VERTEX);
  const fragment = compile(gl, gl.FRAGMENT_SHADER, FRAGMENT);
  const program = gl.createProgram();
  if (!vertex || !fragment || !program) return null;
  gl.attachShader(program, vertex);
  gl.attachShader(program, fragment);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return null;
  gl.useProgram(program);
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([-1, -1, 3, -1, -1, 3]),
    gl.STATIC_DRAW
  );
  const position = gl.getAttribLocation(program, "position");
  gl.enableVertexAttribArray(position);
  gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
  gl.texImage2D(
    gl.TEXTURE_2D,
    0,
    gl.LUMINANCE,
    256,
    1,
    0,
    gl.LUMINANCE,
    gl.UNSIGNED_BYTE,
    PERMUTATION.subarray(0, 256)
  );
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  const at = (name) => gl.getUniformLocation(program, name);
  const uniforms = {
    permutation: at("permutation"),
    size: at("size"),
    dpr: at("dpr"),
    feature: at("feature"),
    z: at("z"),
    step: at("step"),
    range: at("range"),
    amount: at("amount"),
    lift: at("lift"),
    hillRadius: at("hillRadius"),
    hill: at("hill"),
    ripples: at("ripples"),
    reach: at("reach"),
    rippleWidth: at("rippleWidth"),
    color: at("color")
  };
  gl.uniform1i(uniforms.permutation, 0);
  gl.uniform1f(uniforms.range, RANGE);
  gl.uniform1f(uniforms.hillRadius, HILL_RADIUS);
  gl.uniform1f(uniforms.rippleWidth, RIPPLE_WIDTH);
  return (frame) => {
    const w = Math.max(1, Math.round(frame.width * frame.dpr));
    const h = Math.max(1, Math.round(frame.height * frame.dpr));
    gl.viewport(0, 0, w, h);
    gl.uniform2f(uniforms.size, w, h);
    gl.uniform1f(uniforms.dpr, frame.dpr);
    gl.uniform1f(uniforms.feature, frame.feature);
    gl.uniform1f(uniforms.z, frame.z);
    gl.uniform1f(uniforms.step, frame.step);
    gl.uniform1f(uniforms.amount, frame.amount);
    gl.uniform1f(uniforms.lift, frame.lift);
    gl.uniform2f(uniforms.hill, frame.hill[0], frame.hill[1]);
    gl.uniform4fv(uniforms.ripples, frame.ripples);
    gl.uniform1f(uniforms.reach, frame.reach);
    gl.uniform3f(uniforms.color, ...frame.color);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  };
}

window.KienScenes.topography=(root,canvas,settings)=>window.KienScenes.gpuStage(root,canvas,settings,(gl)=>{
 const render=createGlRenderer(gl);if(!render)throw new Error('Contour shader unavailable');
 const ripples=new Float32Array(16),waves=[];let clock=9000,last=0,lift=0,target=0,hill=[0,0],pointer=[0,0];
 return {resize(){},move(x,y){pointer=[x,y];target=1;},leave(){target=0;},down(x,y){waves.push({x,y,start:clock});if(waves.length>4)waves.shift();},draw(time,pixels){
  const blend=last?1-Math.exp(-Math.min(time-last,100)/180):1;last=time;clock=time;
  lift+=(target-lift)*blend;hill=hill.map((v,i)=>v+(pointer[i]-v)*blend);
  ripples.fill(0);for(let i=waves.length-1;i>=0;i--)if(time-waves[i].start>1800)waves.splice(i,1);
  waves.forEach((wave,i)=>ripples.set([wave.x,wave.y,(time-wave.start)/1800,1],i*4));
  const width=pixels.width/pixels.dpr,height=pixels.height/pixels.dpr;
  render({width,height,dpr:pixels.dpr,feature:280,z:time*.000018,step:1.9/16,amount:1,lift:lift*1.2,hill,ripples,reach:Math.hypot(width,height)*.8,color:[.72,.67,.84]});
 }};
});})();
