// Authoritative room rules. Clients never submit points, deadlines or answer keys.
export class BattleError extends Error {}
const fail=message=>{throw new BattleError(message);};
export function createRoom(code,actor,settings,bank,now=Date.now(),random=Math.random){
 const subject=['history','information','ai'].includes(settings.subject)?settings.subject:fail('Môn học không hợp lệ.');
 const count=Number(settings.count),seconds=Number(settings.seconds);
 if(![5,10,20].includes(count)||![15,20,30,45].includes(seconds))fail('Cấu hình lượt đấu không hợp lệ.');
 const pool=bank[subject].filter(q=>q.answers?.length===1&&q.options.length>=2&&!q.extra&&!q.review);
 for(let i=pool.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[pool[i],pool[j]]=[pool[j],pool[i]];}
 if(pool.length<count)fail('Chưa đủ câu có một đáp án rõ ràng.');
 return {version:1,code,createdAt:now,expiresAt:now+12*3600000,host:actor.id,settings:{subject,count,seconds},phase:'lobby',round:0,roundStart:0,deadline:0,players:[player(actor,now)],questions:pool.slice(0,count),chat:[],banned:[]};
}
function player(actor,now){return {id:actor.id,name:actor.name,avatar:actor.avatar||null,joinedAt:now,ready:false,left:false,score:0,elapsed:0,answers:{},voice:false,muted:true};}
export class BattleEngine {
 constructor(state,clock=Date.now){this.s=state;this.clock=clock;}
 member(id){return this.s.players.find(p=>p.id===id&&!p.left)||fail('Bạn không còn ở trong phòng.');}
 join(actor){const s=this.s;if(s.expiresAt<=this.clock())fail('Phòng đã hết hạn.');if(s.banned.includes(actor.id))fail('Bạn đã được chủ phòng mời rời phòng.');let p=s.players.find(x=>x.id===actor.id);if(p&&!p.left){p.name=actor.name;p.avatar=actor.avatar||null;return p;}if(!p&&s.players.length>=64)fail('Phòng đã đạt giới hạn lượt tham gia. Hãy tạo phòng mới.');if(s.phase!=='lobby')fail('Trận đã bắt đầu. Bạn có thể tham gia lượt tiếp theo.');if(s.players.filter(x=>!x.left).length>=8)fail('Phòng đã đủ 8 người.');if(p){Object.assign(p,player(actor,this.clock()));}else{s.players.push(p=player(actor,this.clock()));}if(!s.host)s.host=p.id;return p;}
 command(id,message,online=[]){const s=this.s,p=this.member(id),now=this.clock();if(s.expiresAt<=now)fail('Phòng đã hết hạn.');
  switch(message.type){
   case 'ready':if(s.phase!=='lobby')fail('Lượt đấu đã bắt đầu.');p.ready=message.ready===true;break;
   case 'start':{if(id!==s.host)fail('Chỉ chủ phòng được bắt đầu.');if(s.phase!=='lobby')fail('Lượt đấu đã bắt đầu.');const active=s.players.filter(x=>!x.left);if(active.length<2)fail('Cần ít nhất hai người để tranh đấu.');if(active.some(x=>!x.ready||!online.includes(x.id)))fail('Mọi người cần trực tuyến và sẵn sàng.');s.phase='playing';s.round=0;s.roundStart=now+4000;s.deadline=s.roundStart+s.settings.seconds*1000;break;}
   case 'answer':{if(s.phase!=='playing'||message.round!==s.round||now<s.roundStart||now>=s.deadline)fail('Câu này chưa mở hoặc đã hết giờ.');if(p.answers[s.round])fail('Bạn đã khóa đáp án cho câu này.');const q=s.questions[s.round],choice=String(message.choice);if(!'ABCD'.slice(0,q.options.length).includes(choice)||choice.length!==1)fail('Phương án không hợp lệ.');const elapsed=now-s.roundStart,correct=q.answers.includes(choice);p.answers[s.round]={choice,elapsed,correct};p.elapsed+=elapsed;break;}
   case 'chat':{const text=typeof message.text==='string'?message.text.normalize('NFC').trim():'';if(!text||text.length>500)fail('Tin nhắn cần từ 1 đến 500 ký tự.');s.chat.push({id:crypto.randomUUID(),userId:id,name:p.name,text,at:now});s.chat=s.chat.slice(-80);break;}
   case 'voice':p.voice=message.joined===true;p.muted=!p.voice||message.muted!==false;break;
   case 'leave':if(s.phase==='finished'){p.voice=false;p.muted=true;if(s.host===id)s.host=s.players.find(x=>x.id!==id&&!x.left&&online.includes(x.id))?.id||id;break;}p.left=true;p.avatar=null;p.voice=false;p.ready=false;if(s.host===id)s.host=s.players.find(x=>!x.left)?.id||'';break;
   case 'kick':if(id!==s.host||s.phase!=='lobby'||message.target===id)fail('Không thể mời thành viên này rời phòng.');{const target=this.member(message.target);target.left=true;target.avatar=null;target.voice=false;s.banned.push(target.id);}break;
   case 'rematch':if(id!==s.host||s.phase!=='finished')fail('Chỉ chủ phòng được tạo lượt mới sau kết quả.');s.phase='lobby';s.round=0;s.deadline=0;for(const x of s.players){x.ready=false;x.score=0;x.elapsed=0;x.answers={};}s.questions=[...s.questions.slice(1),s.questions[0]];break;
   default:fail('Thao tác không hợp lệ.');
  }
 }
 tick(){const s=this.s,now=this.clock();if(s.phase!=='playing'||now<s.deadline)return false;for(const p of s.players){const a=p.answers[s.round];if(a?.correct)p.score+=1000+Math.max(0,Math.round(500*(1-a.elapsed/(s.settings.seconds*1000))));if(!a)p.elapsed+=s.settings.seconds*1000;}if(s.round+1>=s.questions.length){s.phase='finished';s.finishedAt=now;}else{s.round++;s.roundStart=now+2500;s.deadline=s.roundStart+s.settings.seconds*1000;}return true;}
 transferHost(online){if(!online.includes(this.s.host)){const candidate=this.s.players.find(p=>!p.left&&online.includes(p.id));if(candidate)this.s.host=candidate.id;}}
 snapshot(id,online=[]){const s=this.s,q=s.questions[s.round],mine=s.players.find(x=>x.id===id);const ranked=s.players.filter(p=>!p.left).sort((a,b)=>b.score-a.score||a.elapsed-b.elapsed||a.joinedAt-b.joinedAt);let rank=0;const players=ranked.map((p,i)=>{if(i===0||p.score!==ranked[i-1].score||p.elapsed!==ranked[i-1].elapsed)rank=i+1;return {id:p.id,name:p.name,avatar:p.avatar,ready:p.ready,left:p.left,online:online.includes(p.id),voice:p.voice,muted:p.muted,score:p.score,answered:!!p.answers[s.round],rank,correct:s.phase==='finished'?Object.values(p.answers).filter(a=>a.correct).length:null};});players.push(...s.players.filter(p=>p.left).map(p=>({id:p.id,name:p.name,avatar:p.avatar,left:true,online:false,voice:false,muted:true,score:p.score,rank:null})));return {code:s.code,host:s.host,settings:s.settings,phase:s.phase,round:s.round,total:s.questions.length,roundStart:s.roundStart,deadline:s.deadline,now:this.clock(),expiresAt:s.expiresAt,players,chat:s.chat,question:s.phase==='playing'?{key:q.key,question:q.question,options:q.options}:null,myChoice:mine?.answers[s.round]?.choice||null,review:s.phase==='finished'?s.questions.map((x,i)=>({question:x.question,options:x.options,answers:x.answers,explanation:x.explanation,mine:mine?.answers[i]?.choice||null})):null};}
}
