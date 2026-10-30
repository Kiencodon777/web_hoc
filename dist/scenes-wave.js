'use strict';
// Noise-deformed gradient mesh adapted from the user-supplied gradientwave.txt.
(()=>{
var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
function normalizeColor(hexCode) {
  return [
    (hexCode >> 16 & 255) / 255,
    (hexCode >> 8 & 255) / 255,
    (255 & hexCode) / 255
  ];
}
class MiniGl {
  constructor(canvas, contextGL) {
    __publicField(this, "canvas");
    __publicField(this, "gl");
    __publicField(this, "meshes", []);
    __publicField(this, "commonUniforms");
    __publicField(this, "width");
    __publicField(this, "height");
    __publicField(this, "Material");
    __publicField(this, "Uniform");
    __publicField(this, "PlaneGeometry");
    __publicField(this, "Mesh");
    __publicField(this, "Attribute");
    this.canvas = canvas;
    const gl = contextGL;
    if (!gl) throw new Error("WebGL not supported");
    this.gl = gl;
    const context = this.gl;
    const _miniGl = this;
    this.Uniform = class {
      constructor(e) {
        __publicField(this, "type", "float");
        __publicField(this, "value");
        __publicField(this, "typeFn");
        __publicField(this, "excludeFrom");
        __publicField(this, "transpose");
        Object.assign(this, e);
        const typeMap = {
          float: "1f",
          int: "1i",
          vec2: "2fv",
          vec3: "3fv",
          vec4: "4fv",
          mat4: "Matrix4fv"
        };
        this.typeFn = typeMap[this.type] || "1f";
      }
      update(location) {
        if (this.value === void 0 || location === null) return;
        const isMatrix = this.typeFn.indexOf("Matrix") === 0;
        const fn = `uniform${this.typeFn}`;
        if (isMatrix) {
          context[fn](location, this.transpose || false, this.value);
        } else {
          context[fn](location, this.value);
        }
      }
      getDeclaration(name, type, length) {
        if (this.excludeFrom === type) return "";
        if (this.type === "array") {
          return this.value[0].getDeclaration(name, type, this.value.length) + `
const int ${name}_length = ${this.value.length};`;
        }
        if (this.type === "struct") {
          let nameNoPrefix = name.replace("u_", "");
          nameNoPrefix = nameNoPrefix.charAt(0).toUpperCase() + nameNoPrefix.slice(1);
          const fields = Object.entries(this.value).map(
            ([n, u]) => u.getDeclaration(n, type).replace(/^uniform/, "")
          ).join("");
          return `uniform struct ${nameNoPrefix} 
{
${fields}
} ${name}${length ? `[${length}]` : ""};`;
        }
        return `uniform ${this.type} ${name}${length ? `[${length}]` : ""};`;
      }
    };
    this.Attribute = class {
      constructor(e) {
        __publicField(this, "type", context.FLOAT);
        __publicField(this, "normalized", false);
        __publicField(this, "buffer");
        __publicField(this, "target");
        __publicField(this, "size");
        __publicField(this, "values");
        this.buffer = context.createBuffer();
        Object.assign(this, e);
      }
      update() {
        if (this.values) {
          context.bindBuffer(this.target, this.buffer);
          context.bufferData(this.target, this.values, context.STATIC_DRAW);
        }
      }
      attach(e, t) {
        const n = context.getAttribLocation(t, e);
        if (this.target === context.ARRAY_BUFFER) {
          context.bindBuffer(this.target, this.buffer);
          context.enableVertexAttribArray(n);
          context.vertexAttribPointer(
            n,
            this.size,
            this.type,
            this.normalized,
            0,
            0
          );
        }
        return n;
      }
      use(e) {
        context.bindBuffer(this.target, this.buffer);
        if (this.target === context.ARRAY_BUFFER) {
          context.enableVertexAttribArray(e);
          context.vertexAttribPointer(
            e,
            this.size,
            this.type,
            this.normalized,
            0,
            0
          );
        }
      }
    };
    this.Material = class {
      constructor(vertexShaders, fragments, uniforms = {}) {
        __publicField(this, "uniforms");
        __publicField(this, "uniformInstances", []);
        __publicField(this, "program");
        const material = this;
        function getShader(type, source) {
          const shader = context.createShader(type);
          context.shaderSource(shader, source);
          context.compileShader(shader);
          if (!context.getShaderParameter(shader, context.COMPILE_STATUS)) {
            console.error(context.getShaderInfoLog(shader));
            throw new Error("Shader compilation error");
          }
          return shader;
        }
        function getUniformDeclarations(uniforms2, type) {
          return Object.entries(uniforms2).map(
            ([uniform, value]) => value.getDeclaration(uniform, type)
          ).join("\n");
        }
        material.uniforms = uniforms;
        const prefix = "precision highp float;";
        const vertexSource = `
          ${prefix}
          attribute vec4 position;
          attribute vec2 uv;
          attribute vec2 uvNorm;
          ${getUniformDeclarations(_miniGl.commonUniforms, "vertex")}
          ${getUniformDeclarations(uniforms, "vertex")}
          ${vertexShaders}
        `;
        const fragmentSource = `
          ${prefix}
          ${getUniformDeclarations(_miniGl.commonUniforms, "fragment")}
          ${getUniformDeclarations(uniforms, "fragment")}
          ${fragments}
        `;
        material.program = context.createProgram();
        context.attachShader(
          material.program,
          getShader(context.VERTEX_SHADER, vertexSource)
        );
        context.attachShader(
          material.program,
          getShader(context.FRAGMENT_SHADER, fragmentSource)
        );
        context.linkProgram(material.program);
        if (!context.getProgramParameter(material.program, context.LINK_STATUS)) {
          console.error(context.getProgramInfoLog(material.program));
          throw new Error("Program linking error");
        }
        context.useProgram(material.program);
        material.attachUniforms(void 0, _miniGl.commonUniforms);
        material.attachUniforms(void 0, material.uniforms);
      }
      attachUniforms(name, uniforms) {
        if (name === void 0) {
          Object.entries(uniforms).forEach(
            ([n, u]) => this.attachUniforms(n, u)
          );
        } else if (uniforms.type === "array") {
          uniforms.value.forEach(
            (u, i) => this.attachUniforms(`${name}[${i}]`, u)
          );
        } else if (uniforms.type === "struct") {
          Object.entries(uniforms.value).forEach(
            ([u, i]) => this.attachUniforms(`${name}.${u}`, i)
          );
        } else {
          this.uniformInstances.push({
            uniform: uniforms,
            location: context.getUniformLocation(this.program, name)
          });
        }
      }
    };
    this.PlaneGeometry = class {
      constructor() {
        __publicField(this, "width", 1);
        __publicField(this, "height", 1);
        __publicField(this, "attributes");
        __publicField(this, "vertexCount", 0);
        __publicField(this, "xSegCount", 0);
        __publicField(this, "ySegCount", 0);
        this.attributes = {
          position: new _miniGl.Attribute({
            target: context.ARRAY_BUFFER,
            size: 3
          }),
          uv: new _miniGl.Attribute({ target: context.ARRAY_BUFFER, size: 2 }),
          uvNorm: new _miniGl.Attribute({
            target: context.ARRAY_BUFFER,
            size: 2
          }),
          index: new _miniGl.Attribute({
            target: context.ELEMENT_ARRAY_BUFFER,
            size: 3,
            type: context.UNSIGNED_SHORT
          })
        };
      }
      setTopology(xSegs = 1, ySegs = 1) {
        this.xSegCount = xSegs;
        this.ySegCount = ySegs;
        this.vertexCount = (this.xSegCount + 1) * (this.ySegCount + 1);
        const quadCount = this.xSegCount * this.ySegCount * 2;
        this.attributes.uv.values = new Float32Array(2 * this.vertexCount);
        this.attributes.uvNorm.values = new Float32Array(2 * this.vertexCount);
        this.attributes.index.values = new Uint16Array(3 * quadCount);
        for (let y = 0; y <= this.ySegCount; y++) {
          for (let x = 0; x <= this.xSegCount; x++) {
            const i = y * (this.xSegCount + 1) + x;
            this.attributes.uv.values[2 * i] = x / this.xSegCount;
            this.attributes.uv.values[2 * i + 1] = 1 - y / this.ySegCount;
            this.attributes.uvNorm.values[2 * i] = x / this.xSegCount * 2 - 1;
            this.attributes.uvNorm.values[2 * i + 1] = 1 - y / this.ySegCount * 2;
            if (x < this.xSegCount && y < this.ySegCount) {
              const s = y * this.xSegCount + x;
              this.attributes.index.values[6 * s] = i;
              this.attributes.index.values[6 * s + 1] = i + 1 + this.xSegCount;
              this.attributes.index.values[6 * s + 2] = i + 1;
              this.attributes.index.values[6 * s + 3] = i + 1;
              this.attributes.index.values[6 * s + 4] = i + 1 + this.xSegCount;
              this.attributes.index.values[6 * s + 5] = i + 2 + this.xSegCount;
            }
          }
        }
        this.attributes.uv.update();
        this.attributes.uvNorm.update();
        this.attributes.index.update();
      }
      setSize(width = 1, height = 1) {
        this.width = width;
        this.height = height;
        this.attributes.position.values = new Float32Array(
          3 * this.vertexCount
        );
        const offsetX = width / -2;
        const offsetY = height / -2;
        const segWidth = width / this.xSegCount;
        const segHeight = height / this.ySegCount;
        for (let y = 0; y <= this.ySegCount; y++) {
          const posY = offsetY + y * segHeight;
          for (let x = 0; x <= this.xSegCount; x++) {
            const posX = offsetX + x * segWidth;
            const idx = y * (this.xSegCount + 1) + x;
            this.attributes.position.values[3 * idx] = posX;
            this.attributes.position.values[3 * idx + 1] = -posY;
            this.attributes.position.values[3 * idx + 2] = 0;
          }
        }
        this.attributes.position.update();
      }
    };
    this.Mesh = class {
      constructor(geometry, material) {
        __publicField(this, "geometry");
        __publicField(this, "material");
        __publicField(this, "attributeInstances", []);
        this.geometry = geometry;
        this.material = material;
        Object.entries(this.geometry.attributes).forEach(
          ([e, attribute]) => {
            this.attributeInstances.push({
              attribute,
              location: attribute.attach(e, this.material.program)
            });
          }
        );
        _miniGl.meshes.push(this);
      }
      draw() {
        context.useProgram(this.material.program);
        this.material.uniformInstances.forEach(
          ({ uniform, location }) => uniform.update(location)
        );
        this.attributeInstances.forEach(
          ({ attribute, location }) => attribute.use(location)
        );
        context.drawElements(
          context.TRIANGLES,
          this.geometry.attributes.index.values.length,
          context.UNSIGNED_SHORT,
          0
        );
      }
    };
    const identityMatrix = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
    this.commonUniforms = {
      projectionMatrix: new this.Uniform({
        type: "mat4",
        value: identityMatrix
      }),
      modelViewMatrix: new this.Uniform({
        type: "mat4",
        value: identityMatrix
      }),
      resolution: new this.Uniform({ type: "vec2", value: [1, 1] }),
      aspectRatio: new this.Uniform({ type: "float", value: 1 })
    };
  }
  setSize(w = 640, h = 480) {
    this.width = w;
    this.height = h;
    this.canvas.width = w;
    this.canvas.height = h;
    this.gl.viewport(0, 0, w, h);
    this.commonUniforms.resolution.value = [w, h];
    this.commonUniforms.aspectRatio.value = w / h;
  }
  setOrthographicCamera() {
    this.commonUniforms.projectionMatrix.value = [
      2 / this.width,
      0,
      0,
      0,
      0,
      2 / this.height,
      0,
      0,
      0,
      0,
      -1e-3,
      0,
      0,
      0,
      0,
      1
    ];
  }
  render() {
    this.gl.clearColor(0, 0, 0, 0);
    this.gl.clearDepth(1);
    this.meshes.forEach((m) => m.draw());
  }
}
class Gradient {
  constructor(canvas, colors, gl) {
    __publicField(this, "canvas");
    __publicField(this, "colors");
    __publicField(this, "minigl");
    __publicField(this, "mesh");
    __publicField(this, "time", 0);
    __publicField(this, "last", 0);
    __publicField(this, "animationId");
    __publicField(this, "isPlaying", false);
    __publicField(this, "animate", (timestamp) => {
      if (!this.isPlaying) return;
      this.time += Math.min(timestamp - this.last, 1e3 / 15);
      this.last = timestamp;
      this.mesh.material.uniforms.u_time.value = this.time;
      this.minigl.render();
      this.animationId = requestAnimationFrame(this.animate);
    });
    this.canvas = canvas;
    this.colors = colors;
    this.minigl = new MiniGl(canvas, gl);
    this.init();
  }
  init() {
    const sectionColors = this.colors.map(
      (hex) => normalizeColor(parseInt(hex.replace("#", "0x"), 16))
    );
    const uniforms = {
      u_time: new this.minigl.Uniform({ value: 0 }),
      u_shadow_power: new this.minigl.Uniform({ value: 5 }),
      u_darken_top: new this.minigl.Uniform({ value: 0 }),
      u_active_colors: new this.minigl.Uniform({
        value: [1, 1, 1, 1],
        type: "vec4"
      }),
      u_global: new this.minigl.Uniform({
        value: {
          noiseFreq: new this.minigl.Uniform({
            value: [14e-5, 29e-5],
            type: "vec2"
          }),
          noiseSpeed: new this.minigl.Uniform({ value: 5e-6 })
        },
        type: "struct"
      }),
      u_vertDeform: new this.minigl.Uniform({
        value: {
          incline: new this.minigl.Uniform({ value: 0 }),
          offsetTop: new this.minigl.Uniform({ value: -0.5 }),
          offsetBottom: new this.minigl.Uniform({ value: -0.5 }),
          noiseFreq: new this.minigl.Uniform({ value: [3, 4], type: "vec2" }),
          noiseAmp: new this.minigl.Uniform({ value: 320 }),
          noiseSpeed: new this.minigl.Uniform({ value: 10 }),
          noiseFlow: new this.minigl.Uniform({ value: 3 }),
          noiseSeed: new this.minigl.Uniform({ value: 5 })
        },
        type: "struct",
        excludeFrom: "fragment"
      }),
      u_baseColor: new this.minigl.Uniform({
        value: sectionColors[0],
        type: "vec3",
        excludeFrom: "fragment"
      }),
      u_waveLayers: new this.minigl.Uniform({
        value: [],
        excludeFrom: "fragment",
        type: "array"
      })
    };
    for (let i = 1; i < sectionColors.length; i++) {
      uniforms.u_waveLayers.value.push(
        new this.minigl.Uniform({
          value: {
            color: new this.minigl.Uniform({
              value: sectionColors[i],
              type: "vec3"
            }),
            noiseFreq: new this.minigl.Uniform({
              value: [
                2 + i / sectionColors.length,
                3 + i / sectionColors.length
              ],
              type: "vec2"
            }),
            noiseSpeed: new this.minigl.Uniform({ value: 11 + 0.3 * i }),
            noiseFlow: new this.minigl.Uniform({ value: 6.5 + 0.3 * i }),
            noiseSeed: new this.minigl.Uniform({ value: 5 + 10 * i }),
            noiseFloor: new this.minigl.Uniform({ value: 0.1 }),
            noiseCeil: new this.minigl.Uniform({ value: 0.63 + 0.07 * i })
          },
          type: "struct"
        })
      );
    }
    const vertexShader = `
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

float snoise(vec3 v) {
  const vec2 C = vec2(1.0/6.0, 1.0/3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i  = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;
  i = mod289(i);
  vec4 p = permute(permute(permute(i.z + vec4(0.0, i1.z, i2.z, 1.0)) + i.y + vec4(0.0, i1.y, i2.y, 1.0)) + i.x + vec4(0.0, i1.x, i2.x, 1.0));
  float n_ = 0.142857142857;
  vec3 ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);
  vec4 x = x_ *ns.x + ns.yyyy;
  vec4 y = y_ *ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);
  vec4 s0 = floor(b0)*2.0 + 1.0;
  vec4 s1 = floor(b1)*2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
  vec3 p0 = vec3(a0.xy,h.x);
  vec3 p1 = vec3(a0.zw,h.y);
  vec3 p2 = vec3(a1.xy,h.z);
  vec3 p3 = vec3(a1.zw,h.w);
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
  p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
}

vec3 blendNormal(vec3 base, vec3 blend) { return blend; }
vec3 blendNormal(vec3 base, vec3 blend, float opacity) { return (blend * opacity + base * (1.0 - opacity)); }

varying vec3 v_color;

void main() {
  float time = u_time * u_global.noiseSpeed;
  vec2 noiseCoord = resolution * uvNorm * u_global.noiseFreq;
  float tilt = resolution.y / 2.0 * uvNorm.y;
  float incline = resolution.x * uvNorm.x / 2.0 * u_vertDeform.incline;
  float offset = resolution.x / 2.0 * u_vertDeform.incline * mix(u_vertDeform.offsetBottom, u_vertDeform.offsetTop, uv.y);
  
  float noise = snoise(vec3(
    noiseCoord.x * u_vertDeform.noiseFreq.x + time * u_vertDeform.noiseFlow,
    noiseCoord.y * u_vertDeform.noiseFreq.y,
    time * u_vertDeform.noiseSpeed + u_vertDeform.noiseSeed
  )) * u_vertDeform.noiseAmp;
  
  noise *= 1.0 - pow(abs(uvNorm.y), 2.0);
  noise = max(0.0, noise);
  
  vec3 pos = vec3(position.x, position.y + tilt + incline + noise - offset, position.z);
  
  v_color = u_baseColor;
  
  for (int i = 0; i < u_waveLayers_length; i++) {
    if (u_active_colors[i + 1] == 1.) {
      WaveLayers layer = u_waveLayers[i];
      float layerNoise = smoothstep(
        layer.noiseFloor,
        layer.noiseCeil,
        snoise(vec3(
          noiseCoord.x * layer.noiseFreq.x + time * layer.noiseFlow,
          noiseCoord.y * layer.noiseFreq.y,
          time * layer.noiseSpeed + layer.noiseSeed
        )) / 2.0 + 0.5
      );
      v_color = blendNormal(v_color, layer.color, pow(layerNoise, 4.));
    }
  }
  
  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}`;
    const fragmentShader = `
varying vec3 v_color;

void main() {
  vec3 color = v_color;
  if (u_darken_top == 1.0) {
    vec2 st = gl_FragCoord.xy/resolution.xy;
    color.g -= pow(st.y + sin(-12.0) * st.x, u_shadow_power) * 0.4;
  }
  gl_FragColor = vec4(color, 1.0);
}`;
    const material = new this.minigl.Material(
      vertexShader,
      fragmentShader,
      uniforms
    );
    const geometry = new this.minigl.PlaneGeometry();
    this.mesh = new this.minigl.Mesh(geometry, material);
  }
  resize(width, height) {
    this.minigl.setSize(width, height);
    this.minigl.setOrthographicCamera();
    const xSegCount = Math.ceil(width * 0.02);
    const ySegCount = Math.ceil(height * 0.05);
    this.mesh.geometry.setTopology(xSegCount, ySegCount);
    this.mesh.geometry.setSize(width, height);
    this.mesh.material.uniforms.u_shadow_power.value = width < 600 ? 5 : 6;
  }
  start() {
    this.isPlaying = true;
    this.animationId = requestAnimationFrame(this.animate);
  }
  stop() {
    this.isPlaying = false;
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
  }
}

window.KienScenes.wave=(root,canvas,settings)=>window.KienScenes.gpuStage(root,canvas,settings,(gl)=>{
 // Four active color slots match the shader's vec4 indexing.
 const gradient=new Gradient(canvas,['#38bdf8','#f1edf9','#7092da','#d2b8ef'],gl),u=gradient.mesh.material.uniforms;
 u.u_global.value.noiseSpeed.value=.00001;u.u_global.value.noiseFreq.value=[.0001,.0009];
 u.u_vertDeform.value.incline.value=.5;u.u_vertDeform.value.noiseAmp.value=250;u.u_vertDeform.value.noiseFlow.value=5;
 return {resize(pixels){gradient.resize(pixels.width,pixels.height);},draw(time){u.u_time.value=time;gradient.minigl.render();}};
});})();
