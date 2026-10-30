'use strict';
window.KienScenes=window.KienScenes||{};
// Bound backing-store memory independently of a phone's advertised DPR.
window.KienScenes.surfaceSize=function(root,maxDpr=1.5,maxPixels=1600000){
 const width=Math.round(root.clientWidth||root.offsetWidth),height=Math.round(root.clientHeight||root.offsetHeight);
 if(width<2||height<2)return null;
 const dpr=Math.min(window.devicePixelRatio||1,maxDpr,4096/width,4096/height,Math.sqrt(maxPixels/(width*height)));
 return {width:Math.max(1,Math.floor(width*dpr)),height:Math.max(1,Math.floor(height*dpr)),dpr};
};
