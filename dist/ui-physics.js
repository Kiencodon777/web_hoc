/* Distance mapping and spring values from the supplied Apple Dock Navigation.
   Axis is vertical here. Small integration steps keep low-mass springs stable. */
window.KienPhysics={
 gaussian(d,sigma=78){return Math.exp(-(d*d)/(2*sigma*sigma));},
 wheelMetrics(w,h,count){
  const cardW=Math.min(h*.38*1.45,w*.34),cardH=cardW/1.45,ringR=cardH*1.14;
  return {cardW,cardH,ringR,ringScale:count?Math.min(1,Math.max(.16,2*Math.PI*ringR/count*.82/(cardW||1))):1,drumR:cardH*2.22,bow:cardH*1.82,depth:cardH*2.7};
 },
 wheelPlace(ringDeg,drumDeg,ringR,drumR,bow,m){
  return `translateX(${-m*bow*(1-Math.cos(drumDeg*Math.PI/180))}px) rotateZ(${(1-m)*ringDeg}deg) translateY(${-(1-m)*ringR}px) rotateX(${m*drumDeg}deg) translateZ(${m*drumR}px)`;
 },
 influence(distance,radius=150){return Math.max(0,1-Math.abs(distance)/radius);},
 step(x,v,target,dt,{mass=.1,stiffness=150,damping=12}={}){
  const steps=Math.max(1,Math.ceil(Math.min(dt,.05)/(1/240))),h=Math.min(dt,.05)/steps;
  for(let i=0;i<steps;i++){v+=((target-x)*stiffness-damping*v)/mass*h;x+=v*h;}
  return {x,v};
 },
 measure(width,height,tile=70,aspect=1.12,gap=8,curve=65){
  const bend=Math.min(85,Math.max(5,curve))*Math.PI/180,camera=1.6;
  const ratio=(camera-1+Math.cos(bend))/(2*camera*Math.sin(bend));
  const h=Math.min(tile/100*height,.55*width/aspect),radius=width*ratio;
  if(!(h>0&&radius>0))return null;
  const unit=h/radius*180/Math.PI,pitch=(aspect+gap/100)*unit,limit=bend*180/Math.PI+aspect*unit/2;
  const columns=Math.min(60,Math.max(2,Math.ceil(2*limit/pitch))),sweep=columns*pitch/2;
  return {h,radius,unit,columns,sweep,limit:Math.min(sweep,limit)};
 }
};
