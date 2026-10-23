'use strict';
// One schema. `answer` is the primary reference; `answers` preserves valid alternatives.
// A null answer / empty answers array is explicitly ungraded, never guessed.
const QUIZ_CHAPTERS={
 history:[{id:1,title:'Đảng ra đời & giành chính quyền',period:'1858 — 1945'},{id:2,title:'Kháng chiến & thống nhất đất nước',period:'1945 — 1975'},{id:3,title:'Xây dựng đất nước & đổi mới',period:'1975 — 2021'}],
 ai:['Tổng quan & lịch sử AI','Dữ liệu & cơ sở dữ liệu','Công cụ & học máy','Prompt Engineering','Quy trình dự án AI'].map((title,i)=>({id:i+1,title,period:title})),
 information:['Lượng tin & Entropy','Mã nguồn & Huffman','Kiểm soát lỗi & Hamming','Kênh truyền & Shannon','Mật mã & an toàn (đề cương)','Hệ thống, số hóa & điều chế (đề cương)'].map((title,i)=>({id:i+1,title,period:title}))
};
const AI_HINTS=[
 'Phân biệt suy nghĩ và hành động; như con người và theo lý tính. Với mốc lịch sử, đặt sự kiện vào đúng giai đoạn.',
 'Xác định kiểu dữ liệu, nguồn thu thập và mục tiêu xử lý. Phân biệt làm sạch, lưu trữ, khai phá và bảo mật.',
 'Tách công cụ xử lý dữ liệu khỏi thuật toán học. Phân biệt nhãn, loại đầu ra và thước đo đánh giá.',
 'Đọc mục tiêu, ngữ cảnh, vai trò, ví dụ và ràng buộc đầu ra. Chọn kỹ thuật đúng với nhu cầu được hỏi.',
 'Đi theo chuỗi: xác định bài toán → dữ liệu → mô hình → đánh giá → trình bày. Phân biệt huấn luyện, kiểm định và kiểm tra.'
];
const INFO_HINTS=[
 'Phân biệt lượng tin riêng và entropy trung bình. Chú ý chiều của xác suất có điều kiện và giả thiết độc lập.',
 'Kiểm tra quan hệ tiền tố; đếm độ dài theo từng xác suất. Huffman ghép hai trọng số nhỏ nhất mỗi bước.',
 'Xác định n, k và d_min. Phân biệt phát hiện lỗi, sửa lỗi và mã hóa bảo mật.',
 'Xác định mô hình kênh và đơn vị. Khi tính Shannon, đổi SNR dB sang tỷ số công suất tuyến tính trước.',
 'Phân biệt bản rõ, bản mã và khóa. Với Caesar, quy ước A=0 và tính modulo 26; với an toàn, đọc đúng giả thiết về khóa.',
 'Phân biệt nguồn, kênh và máy thu; thời gian lấy mẫu và biên độ lượng tử; AM, FM, PM và các dạng số.'
];
const QUIZ_DATA={
 history:QUESTIONS.map(q=>({...q,subject:'history',legacyKey:q.key,key:'history.'+q.key,id:'history_'+q.id,answers:[q.answer],labels:['A','B','C','D'],origin:'pdf'})),
 ai:AI_QUESTIONS.map(q=>{const a=AI_ANSWERS[q.number],ch=q.number<=20?1:q.number<=40?2:q.number<=60?3:q.number<=86?4:5;return {...q,subject:'ai',chapter:ch,id:'ai_'+q.number,key:'ai.'+q.number,answer:a.answer||null,answers:a.answer?[a.answer]:[],labels:q.options.map((_,i)=>'ABCD'[i]),explanation:a.explanation,note:a.note||'',hint:AI_HINT_BY_NUMBER[q.number]||AI_HINTS[ch-1],review:!!a.review||!a.answer,tier:!a.answer||/KHÔNG|không|quá khớp|siêu tham số|validation/.test(q.question)?8:ch===1||ch===2?6:7,topic:QUIZ_CHAPTERS.ai[ch-1].title,origin:'pdf',sources:[],sourceNote:'Đề cương KHDL–TTNT và bảng giải tham khảo do chủ trang cung cấp. PDF không có câu 74.'};}),
 information:[...INFO_QUESTIONS.map(q=>{const ch=q.topic==='Mã tiền tố'?2:q.topic==='Mã chống lỗi'?3:q.topic==='Thông tin & entropy'?1:q.topic==='Mật mã & an toàn'?5:6;return {...q,subject:'information',chapter:ch,id:'information_'+q.number,key:'information.'+q.number,answer:q.answers[0]||null,hint:INFO_HINTS[ch-1],review:!!q.note||q.answers.length!==1,tier:q.answers.length!==1?8:/tính|ma trận|Công thức|Quan hệ|Mối quan hệ/.test(q.question)?7:6,origin:'pdf',sources:[{label:'Đề gốc · trang '+q.page,url:'docs/sv-on-thi-truyen-tin.pdf#page='+q.page},...q.sources.map(id=>({label:INFO_SOURCES[id][0],url:INFO_SOURCES[id][1]}))]};}),...INFO_PRACTICE.map(q=>({...q,labels:['A','B','C','D']}))]
};
const ALL_QUIZ_QUESTIONS=Object.values(QUIZ_DATA).flat();
const BYKEY=Object.fromEntries(ALL_QUIZ_QUESTIONS.map(q=>[q.key,q]));
function acceptedAnswers(q){return q.answers|| (q.answer?[q.answer]:[]);}
function isGradable(q){return acceptedAnswers(q).length>0&&!q.extra;}
function isCorrect(q,a){return isGradable(q)&&acceptedAnswers(q).includes(a);}
function choiceLabel(q,a){return q.labels?.['ABCD'.indexOf(a)]||a||'—';}
function answerLabel(q){return acceptedAnswers(q).map(a=>choiceLabel(q,a)).join(' hoặc ')||'Chưa chấm';}
for(const s of SUBJECTS){const list=QUIZ_DATA[s.id].filter(q=>!q.extra);s.count=list.length+' câu hỏi';if(s.id==='information')s.desc='151 câu đề cương và 48 bài tập tính toán có lời giải. Học, nghe và thi thử theo chương.';s.tag='Học & thi thử';s.topics=s.id==='information'?['151 câu PDF + 48 bài tập','Entropy · Huffman · Hamming','Thi thử & lưu tiến độ']:s.id==='ai'?['115 câu từ đề cương','5 chủ đề kiến thức','Thi thử & lưu tiến độ']:s.topics;}

for(const id of Object.keys(QUIZ_DATA))for(const ch of QUIZ_CHAPTERS[id])ch.count=QUIZ_DATA[id].filter(q=>!q.extra&&q.chapter===ch.id).length;
