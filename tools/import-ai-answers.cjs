const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.join(__dirname,'..'),source=fs.readFileSync(path.join(root,'content-sources/ai-answers.md'),'utf8');
const questions=JSON.parse(fs.readFileSync(path.join(root,'dist/ai-questions.js'),'utf8').split('=').slice(1).join('=').trim().replace(/;$/,''));
const clean=s=>s.replace(/\*\*/g,'').replace(/\\\*/g,'*').replace(/\s*\(\*\)/g,'').replace(/`/g,'').replace(/\\+\(R\^2\\+\)/g,'R²').trim();
const notes={
 11:'Không thể kết luận Python không phải nền tảng của AI. Nếu giáo trình chỉ liệt kê Lisp và Prolog thì có thể là C; nếu đề cập cả ba thì là D. Cần đối chiếu giáo trình.',
 16:'Chọn D theo từ khóa “trở nên phổ biến”. C nói về giai đoạn phát triển các hệ thống dựa trên tri thức, là nền tảng cho hệ chuyên gia.',
 28:'Điền 0 có thể là điền giá trị thiếu bằng hằng số nếu phù hợp với ý nghĩa dữ liệu. Đề có thể dự kiến C, nhưng cả bốn cách đều có thể dùng trong điều kiện phù hợp.',
 32:'Chọn C theo cách phân loại cơ bản của đề; thực tế trực quan hóa vẫn hỗ trợ khám phá và khai phá dữ liệu.',
 37:'Khóa ngoại còn có thể tham chiếu khóa duy nhất phù hợp và có thể tham chiếu ngay trong cùng một bảng.',
 42:'Nếu giáo trình chỉ xét quy trình phân tích mô tả, đề có thể dự kiến C. Tuy nhiên, phân tích dự đoán có dùng mô hình thống kê và học máy, nên không thể loại C trong mọi quy trình.',
 50:'Đề nhiều khả năng dự kiến A nếu nói Pandas hỗ trợ dữ liệu bảng và chuỗi thời gian. Nhưng Series là mảng một chiều có nhãn, không đồng nghĩa với chuỗi thời gian; nếu xét khẳng định đó thì B. Cần hỏi lại giảng viên.',
 94:'D cũng là công dụng của validation vì có thể dùng để so sánh mô hình. Nếu chỉ chọn một đáp án, bảng tham khảo chọn A vì đầy đủ hơn về vai trò điều chỉnh.',
 96:'Mục đích chung là lưu mô hình để nạp lại và sử dụng, kể cả trong chính dự án hiện tại. Chia sẻ mô hình ở phương án C cũng là mục đích hợp lệ.',
 97:'Chọn B vì đó là dạng biểu đồ trực tiếp. Excel ở A cũng có thể tạo biểu đồ, nên cách hỏi chưa hoàn toàn loại trừ.',
 113:'B là dạng biểu diễn kết quả trực tiếp; bảng tính cũng có thể hỗ trợ tạo biểu đồ.'
};
const rows=new Map();for(const line of source.split(/\r?\n/)){const m=line.match(/^\|\s*(\d+)\s*\|\s*(.*?)\s*\|\s*(.*?)\s*\|$/);if(!m)continue;const number=Number(m[1]);assert(!rows.has(number),'Duplicate '+number);rows.set(number,{raw:m[2],explanation:clean(m[3])});}
assert.equal(rows.size,116);assert.equal(questions.length,115);assert(!questions.some(q=>q.number===74));
const entries={};for(const q of questions){const row=rows.get(q.number);assert(row,'Missing '+q.number);const match=row.raw.match(/^\*\*([A-D])\./),answer=match?.[1]||null;
 if(answer)assert(q.options['ABCD'.indexOf(answer)],'Invalid option '+q.number);
 entries[q.number]={answer,status:answer?'reference':q.number===50?'provisional':'unresolved',sourceAnswer:clean(row.raw),explanation:row.explanation,note:notes[q.number]||'',review:!!notes[q.number]};
}
assert.equal(Object.values(entries).filter(x=>x.answer).length,111);assert.deepEqual(Object.keys(entries).filter(k=>!entries[k].answer).map(Number),[11,28,42,50]);
fs.writeFileSync(path.join(root,'dist/ai-answers.js'),'// Imported from the supplied reference table; ambiguous items remain ungraded.\nconst AI_ANSWERS='+JSON.stringify(entries,null,1)+';\n');
console.log('Imported 115 explanations, 111 reference answers; 11, 28, 42, 50 remain ungraded. Number 74 is absent from the PDF.');
