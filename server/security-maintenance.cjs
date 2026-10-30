const {Resend}=require('resend');
function notificationMailer(config){
 const resend=config.RESEND_API_KEY?new Resend(config.RESEND_API_KEY):null;
 return async(row)=>{
  if(!resend||!config.EMAIL_FROM)throw Error('Email unavailable');
  const at=new Date(Number(row.created_at)).toISOString();
  const {error}=await resend.emails.send({from:config.EMAIL_FROM,to:[row.email],subject:'Mật khẩu Kiến Học vừa được thay đổi',text:`Mật khẩu của tài khoản Kiến Học đã được thay đổi lúc ${at} (UTC). Nếu không phải bạn thực hiện, hãy mở website Kiến Học bằng địa chỉ bạn đã lưu, đăng nhập bằng OTP từ email của bạn và đổi mật khẩu ngay. Kiểm tra bảo mật hộp thư và không chia sẻ mã OTP. Các phiên khác đã được thu hồi.`},{idempotencyKey:'kienhoc-password-'+row.id});
  if(error)throw Error('Security email failed');
 };
}
async function securityMaintenance(db,config,{now=Date.now(),send=notificationMailer(config)}={}){
 await db.prepare('DELETE FROM sessions WHERE expires_at<?').run(now);
 await db.prepare('DELETE FROM otps WHERE expires_at<?').run(now-86400000);
 const due=await db.prepare('SELECT id FROM security_mail WHERE sent_at IS NULL AND next_attempt<=? AND attempts<8 ORDER BY created_at LIMIT 10').all(now);
 for(const {id} of due){
  const row=await db.transaction(async tx=>{
   const r=await tx.prepare('SELECT m.*,u.email FROM security_mail m JOIN users u ON u.id=m.user_id WHERE m.id=? AND m.sent_at IS NULL AND m.next_attempt<=? AND m.attempts<8').get(id,now);
   if(!r)return null;
   await tx.prepare('UPDATE security_mail SET attempts=attempts+1,next_attempt=? WHERE id=?').run(now+Math.min(3600000,60000*2**r.attempts),id);
   return r;
  },'security-mail:'+id);
  if(!row)continue;
  try{await send(row);await db.prepare('UPDATE security_mail SET sent_at=? WHERE id=?').run(now,id);}
  catch{console.error('SECURITY_EMAIL_RETRY',JSON.stringify({id,attempt:Number(row.attempts)+1}));}
 }
 await db.prepare('DELETE FROM security_mail WHERE created_at<?').run(now-90*86400000);
}
module.exports={securityMaintenance,notificationMailer};
