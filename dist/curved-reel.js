'use strict';
/* One indexed mesh and one canvas for the complete cylinder. Adjacent triangles
   share vertices/UVs; scrolling cannot separate independently composited strips. */
(()=>{
 const TAU=180/Math.PI,segments=48;
 function cardState(g,phase,slot,count,width,height){
  const travel=phase+slot,cycle=Math.floor(travel/g.columns),position=travel-cycle*g.columns;
  const angle=(-g.sweep+position*(2*g.sweep/g.columns))/TAU,arc=g.h*1.12/g.radius,distance=g.radius*1.6;
  let left=Infinity,right=-Infinity,top=Infinity,bottom=-Infinity;
  for(let i=0;i<=segments;i++){
   const a=angle+(.5-i/segments)*arc,w=distance-g.radius*(1-Math.cos(a));if(w<=0)continue;
   const scale=distance/w,x=width/2-g.radius*Math.sin(a)*scale;
   left=Math.min(left,x);right=Math.max(right,x);top=Math.min(top,height/2-g.h/2*scale);bottom=Math.max(bottom,height/2+g.h/2*scale);
  }
  left=Math.max(0,Math.min(width,left));right=Math.max(0,Math.min(width,right));top=Math.max(0,Math.min(height,top));bottom=Math.max(0,Math.min(height,bottom));
  const index=((cycle*g.columns+g.columns-1-slot)%count+count)%count;
  return {slot,index,angle,left,top,width:Math.max(0,right-left),height:Math.max(0,bottom-top),visible:Math.abs(angle*TAU)<g.limit&&right>left&&bottom>top};
 }
 const vertex=`attribute vec2 strip;uniform vec2 size;uniform float radius,height,angle;varying vec2 uv;
 void main(){float a=angle+(.5-strip.x)*height*1.12/radius;float d=radius*1.6;
 float x=-radius*sin(a),z=radius*(1.-cos(a));
 gl_Position=vec4(2.*x*d/size.x,-2.*strip.y*height*d/size.y,0.,d-z);uv=vec2(strip.x,strip.y+.5);}`;
 const fragment=`precision mediump float;uniform sampler2D image;varying vec2 uv;void main(){gl_FragColor=texture2D(image,uv);}`;
 function mount(root,canvas,initialAssets,onCards,onFallback){
  let assets=initialAssets,phase=0,lastTime=null,engine=null,stopped=false,handle;
  const settings={motion:false};
  handle=window.KienScenes.gpuStage(root,canvas,settings,gl=>{
   let dead=false,generation=0,pending=[],texturesReady=false,metrics=null,width=0,height=0;
   const program=gl.createProgram();if(!program)throw Error('No reel program');
   for(const [type,source]of [[gl.VERTEX_SHADER,vertex],[gl.FRAGMENT_SHADER,fragment]]){
    const shader=gl.createShader(type);gl.shaderSource(shader,source);gl.compileShader(shader);
    if(!gl.getShaderParameter(shader,gl.COMPILE_STATUS))throw Error('Reel shader compilation failed');gl.attachShader(program,shader);
   }
   gl.linkProgram(program);if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw Error('Reel program link failed');
   const vertices=[],indices=[];for(let i=0;i<=segments;i++){vertices.push(i/segments,-.5,i/segments,.5);if(i<segments){const n=i*2;indices.push(n,n+1,n+2,n+2,n+1,n+3);}}
   const buffer=gl.createBuffer(),indexBuffer=gl.createBuffer();if(!buffer||!indexBuffer)throw Error('No reel buffers');
   gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(vertices),gl.STATIC_DRAW);
   gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,indexBuffer);gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,new Uint16Array(indices),gl.STATIC_DRAW);
   const position=gl.getAttribLocation(program,'strip'),at=name=>gl.getUniformLocation(program,name),uniforms={size:at('size'),radius:at('radius'),height:at('height'),angle:at('angle'),image:at('image')};
   const textures=assets.map(()=>gl.createTexture());if(textures.some(texture=>!texture))throw Error('No reel textures');
   function cancelImages(){pending.forEach(image=>{image.onload=image.onerror=null;});pending=[];}
   function setAssets(urls){
    const token=++generation;cancelImages();
    Promise.all(urls.map(url=>new Promise((resolve,reject)=>{const image=new Image();pending.push(image);image.onload=()=>resolve(image);image.onerror=()=>reject(Error('Reel artwork unavailable'));image.src=url;}))).then(images=>{
     if(dead||token!==generation)return;cancelImages();
     const anisotropy=gl.getExtension('EXT_texture_filter_anisotropic')||gl.getExtension('WEBKIT_EXT_texture_filter_anisotropic');
     images.forEach((image,i)=>{
      gl.bindTexture(gl.TEXTURE_2D,textures[i]);gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,false);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,image);
      const powerOfTwo=n=>n>0&&(n&(n-1))===0,mipmaps=powerOfTwo(image.naturalWidth)&&powerOfTwo(image.naturalHeight);
      if(mipmaps)gl.generateMipmap(gl.TEXTURE_2D);
      gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,mipmaps?gl.LINEAR_MIPMAP_LINEAR:gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);
      if(anisotropy)gl.texParameterf(gl.TEXTURE_2D,anisotropy.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(4,gl.getParameter(anisotropy.MAX_TEXTURE_MAX_ANISOTROPY_EXT)));
     });
     texturesReady=true;onFallback(false);handle?.invalidate();
    }).catch(()=>{if(!dead&&token===generation)onFallback(true);});
   }
   engine={setAssets,
    resize(){width=root.clientWidth;height=root.clientHeight;metrics=window.KienPhysics.measure(width,height);},
    draw(time,pixels){
     if(lastTime!==null)phase+=(time-lastTime)/5500;lastTime=time;
     if(!metrics||!texturesReady)return;
     gl.viewport(0,0,pixels.width,pixels.height);gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT);gl.useProgram(program);
     gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.enableVertexAttribArray(position);gl.vertexAttribPointer(position,2,gl.FLOAT,false,0,0);gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,indexBuffer);
     gl.enable(gl.BLEND);gl.blendFuncSeparate(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA,gl.ONE,gl.ONE_MINUS_SRC_ALPHA);
     gl.uniform2f(uniforms.size,width,height);gl.uniform1f(uniforms.radius,metrics.radius);gl.uniform1f(uniforms.height,metrics.h);gl.uniform1i(uniforms.image,0);gl.activeTexture(gl.TEXTURE0);
     const cards=Array.from({length:metrics.columns},(_,i)=>cardState(metrics,phase,i,textures.length,width,height));
     cards.forEach(card=>{if(!card.visible)return;gl.bindTexture(gl.TEXTURE_2D,textures[card.index]);gl.uniform1f(uniforms.angle,card.angle);gl.drawElements(gl.TRIANGLES,indices.length,gl.UNSIGNED_SHORT,0);});
     onCards(cards);
    },
    destroy(){dead=true;generation++;cancelImages();}
   };
   onFallback(false);setAssets(assets);return engine;
  },{interval:0,maxDpr:3,maxPixels:4000000,antialias:true,powerPreference:'default'});
  if(!handle.available())onFallback(true);
  const lost=()=>{lastTime=null;onFallback(true);};canvas.addEventListener('webglcontextlost',lost);
  return {
   pause(paused){if(stopped)return;settings.motion=!paused;handle.invalidate();},
   step(direction){if(stopped)return;phase+=direction;handle.invalidate();},
   setAssets(urls){if(stopped)return;assets=urls;engine?.setAssets(urls);},
   destroy(){if(stopped)return;stopped=true;canvas.removeEventListener('webglcontextlost',lost);handle();}
  };
 }
 window.KienReel={mount,cardState};
})();
