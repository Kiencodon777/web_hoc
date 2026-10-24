const zlib=require('node:zlib');
const MAX_AVATAR_BYTES=96*1024;
// The browser crops/re-encodes avatars as PNG: no SVG, URLs, EXIF or animated files.
function validAvatar(value){
 if(value===null)return true;
 if(typeof value!=='string'||value.length>Math.ceil(MAX_AVATAR_BYTES/3)*4+22||!/^data:image\/png;base64,[A-Za-z0-9+/]+={0,2}$/.test(value))return false;
 const bytes=Buffer.from(value.slice(22),'base64');
 if(bytes.length>MAX_AVATAR_BYTES||bytes.length<57||bytes.toString('base64')!==value.slice(22)||!bytes.subarray(0,8).equals(Buffer.from('89504e470d0a1a0a','hex')))return false;
 let pos=8,width,height,channels,ended=false;const data=[];
 while(pos+12<=bytes.length){
  const size=bytes.readUInt32BE(pos),type=bytes.toString('ascii',pos+4,pos+8);
  if(size>MAX_AVATAR_BYTES||pos+12+size>bytes.length)return false;
  if(pos===8){if(type!=='IHDR'||size!==13)return false;width=bytes.readUInt32BE(pos+8);height=bytes.readUInt32BE(pos+12);const depth=bytes[pos+16],color=bytes[pos+17];channels=color===6?4:color===2?3:0;if(!width||!height||width>256||height>256||depth!==8||!channels||bytes[pos+18]||bytes[pos+19]||bytes[pos+20])return false;}
  else if(type==='IHDR'||type==='acTL')return false;
  if(type==='IDAT')data.push(bytes.subarray(pos+8,pos+8+size));
  pos+=size+12;if(type==='IEND'){if(size!==0||pos!==bytes.length)return false;ended=true;break;}
 }
 if(!ended||!data.length)return false;
 // workerd grows inflate buffers in chunks. Leave bounded allocation headroom,
 // then enforce the exact pixel length (at most 262,400 bytes) ourselves.
 try{const row=width*channels+1,raw=zlib.inflateSync(Buffer.concat(data),{maxOutputLength:1024*1024});if(raw.length!==row*height)return false;for(let y=0;y<height;y++)if(raw[y*row]>4)return false;return true;}catch{return false;}
}
function profileInput(body){
 if(!body||!Number.isSafeInteger(body.expectedRevision)||body.expectedRevision<0)throw Error('Hồ sơ chưa được tải đầy đủ. Hãy mở lại và thử lại.');
 if(body.skip===true)return {skip:true,expectedRevision:body.expectedRevision};
 if(typeof body.username!=='string')throw Error('Hãy nhập tên hiển thị.');
 const username=body.username.normalize('NFC').trim().replace(/\s+/gu,' ');
 if(Array.from(username).length<2||Array.from(username).length>32||! /^[\p{L}\p{M}\p{N} _.\-]+$/u.test(username))throw Error('Tên cần 2–32 ký tự: chữ, số, dấu cách, dấu chấm, gạch dưới hoặc gạch ngang.');
 if(!validAvatar(body.avatar))throw Error('Ảnh đại diện không hợp lệ hoặc quá lớn. Hãy chọn lại ảnh.');
 return {username,avatar:body.avatar,expectedRevision:body.expectedRevision};
}
module.exports={validAvatar,profileInput,MAX_AVATAR_BYTES};
