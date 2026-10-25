const fs=require('fs'),vm=require('vm'),assert=require('node:assert/strict'),path=require('path');
const files=['data.js','ai-questions.js','ai-answers.js','information-questions.js','academy.js','question-sources.js','info-questions.js','ai-hints.js','quiz-data.js','quiz-store.js','unified-ui.js','app.js'];
function app(initial={}){const db={...initial},nodes={},listeners={};let now=1000000;class Clock extends Date{static now(){return now;}}function node(s){return nodes[s]??={innerHTML:'',textContent:'',style:{},dataset:{},classList:{toggle(){}},setAttribute(){},addEventListener(){},prepend(){},focus(){},scrollIntoView(){}};}
 const ctx=vm.createContext({console,Date:Clock,Math,JSON,Number,String,Object,Array,Set,localStorage:{getItem:k=>db[k]||null,setItem:(k,v)=>db[k]=v},document:{body:node('body'),querySelector:node,querySelectorAll:()=>[],addEventListener:(t,f)=>(listeners[t]||=[]).push(f),createElement:()=>node('new')},window:{scrollTo(){},confirm:()=>true,addEventListener(){}},setTimeout(){},setInterval(){return 1},clearInterval(){},URL:{},Blob});for(const file of files)vm.runInContext(fs.readFileSync(path.join(__dirname,'../dist',file),'utf8'),ctx,{filename:file});return {db,nodes,run:s=>vm.runInContext(s,ctx),advance:ms=>now+=ms,listeners};}
const original={version:1,progress:{'1.1':{attempts:3,correct:2,last:true,lastAnswer:'B',at:100}},bookmarks:['1.1'],session:{keys:['1.1','1.2'],index:1,answers:{'1.1':'B'},hints:{'1.1':true},hintsUsed:{'1.1':true},mode:'learn',created:100},prefs:{sound:false,speechRate:1.2}};
const a=app({'su-ky-progress-v1':JSON.stringify(original),'kienhoc-ai-choices-v1':'{"1":"B","11":"C","50":"A","74":"D","116":"Z"}','kienhoc-info-choices-v1':'{"55":"D","63":"B","143":"A"}'}),{run,db,nodes}=a;
assert.equal(run('currentSubject'),'history');assert.equal(run('view'),'catalog');
assert.equal(run('CORE.length'),362);assert.equal(run('QUIZ_DATA.ai.length'),115);assert.equal(run('QUIZ_DATA.information.length'),199);
assert.equal(run('progressRoot.history.progress["history.1.1"].attempts'),3);
assert.equal(run('saved.prefs.speechRate'),1.2);assert.equal(run('saved.prefs.sound'),false);
assert.equal(run('saved.session.keys[0]'),'history.1.1');assert.equal(run('saved.session.index'),1);assert(run('saved.session.hintsUsed["history.1.1"]'));
assert.equal(run('progressRoot.ai.progress["ai.1"].last'),true);assert.equal(run('progressRoot.ai.progress["ai.11"].last'),null);assert.equal(run('Object.keys(progressRoot.ai.progress).length'),3);
assert.equal(run('progressRoot.information.progress["information.55"].last'),true);assert.equal(run('progressRoot.information.progress["information.143"].last'),null);
assert.equal(run('QUIZ_DATA.ai.filter(q=>!isGradable(q)).map(q=>q.number).join(",")'),'11,28,42,50');
assert.equal(run('QUIZ_DATA.information.filter(q=>!isGradable(q)).map(q=>q.number).join(",")'),'20,53,59,69,80,112,129,143');
assert(run('ALL_QUIZ_QUESTIONS.every(q=>q.subject&&q.key.startsWith(q.subject+".")&&q.id.startsWith(q.subject+"_")&&q.hint&&q.explanation&&[6,7,8].includes(q.tier)&&q.options.length>=2&&q.options.length<=4&&acceptedAnswers(q).every(a=>q.options["ABCD".indexOf(a)]))'));
assert.equal(run('new Set(ALL_QUIZ_QUESTIONS.map(q=>q.key)).size'),run('ALL_QUIZ_QUESTIONS.length'));
assert(run('catalogPage().includes("Tiến độ từng môn")'));assert(run('catalogPage().includes("/115")'));
run('subjectQuery="truyen tin"');assert(run('courseCards().includes("1 môn học phù hợp")'));run('subjectQuery=""');
run('openSubject("ai");go("bank");onlyReview=true');assert(run('filtered().some(q=>q.number===11)'));run('onlyReview=false;query="11"');assert.equal(run('filtered().length'),1);assert.equal(run('filtered()[0].number'),11);
run('query="";chapter=4');assert(run('filtered().every(q=>q.chapter===4)'));run('chapter=0;size=0;order="original";mode="exam";examMinutes=10;start(filtered())');assert.equal(run('session.keys.length'),115);assert.equal(run('session.deadline-session.created'),600000);assert.equal(run('quiz().includes(BYKEY[session.keys[0]].explanation)'),false);assert(run('quiz()').includes('data-tts="ai.1"'));
run('selectAnswer("A");selectAnswer("B")');assert.equal(run('session.answers["ai.1"]'),'B');
run('moveQuestion(49);selectAnswer("D")');assert.equal(run('session.answers[session.keys[49]]'),undefined,'two-option item ignores invalid keyboard choice');
run('moveQuestion(10);selectAnswer("C");toggleBookmark("ai.11");go("catalog")');assert.equal(run('progressRoot.ai.session.index'),10);const deadline=run('progressRoot.ai.session.deadline');
run('openSubject("information")');assert.equal(run('saved.bookmarks.length'),0);assert.equal(run('CORE.length'),199);assert.equal(run('progressRoot.ai.bookmarks[0]'),'ai.11');
run('go("bank");bankOrigin="practice"');assert.equal(run('filtered().length'),48);
for(let ch=1;ch<=4;ch++)assert.equal(run('INFO_PRACTICE.filter(q=>q.chapter==='+ch+').length'),12);
run('bankOrigin="pdf";query="63"');assert.equal(run('filtered()[0].answer'),'A');assert(run('filtered()[0].note.includes("Đáp án B")'));
run('bankOrigin="all";query="";chapter=0;size=0;mode="exam";start([BYKEY["information.55"],BYKEY["information.143"],BYKEY["information.63"]]);selectAnswer("D");moveQuestion(1);selectAnswer("A");moveQuestion(2);selectAnswer("A");finish()');
assert.equal(run('result.right'),2);assert(run('resultPage().includes("10.00")'));assert(run('resultPage().includes("1 không chấm")'));assert.equal(run('saved.progress["information.143"].last'),null);
run('go("wrong")');assert(!run('filtered().some(q=>q.number===143)'));assert.equal(run('filtered().length'),0);
run('openSubject("ai");resume()');assert.equal(run('session.deadline'),deadline);a.advance(600001);run('tickTimer()');assert.equal(run('view'),'result');assert.equal(run('result.expired'),true);assert.equal(run('saved.session'),null);assert(run('resultPage().includes("111 câu chấm được")'));
run('openSubject("history");resume()');assert.equal(run('session.index'),1);assert.equal(run('saved.prefs.sound'),false);run('go("catalog")');
const again=app(db);assert.equal(again.run('progressRoot.ai.bookmarks[0]'),'ai.11');assert.equal(again.run('progressRoot.information.progress["information.55"].last'),true);assert.equal(again.run('progressRoot.history.session.keys[0]'),'history.1.1');
// Every numerical question with calculation metadata is recomputed independently.
for(const q of JSON.parse(run('JSON.stringify(INFO_PRACTICE)'))){assert(q.explanation.includes('=')||q.explanation.includes('Σ'));const c=q.calc;if(!c)continue;let v;switch(c.type){case'self':v=Math.log2(1/c.p);break;case'entropy':v=c.p.reduce((s,p)=>s+(p?p*Math.log2(1/p):0),0);break;case'length':v=c.p.reduce((s,p,i)=>s+p*c.lengths[i],0);break;case'huffman':{let weights=[...c.p],sum=0;while(weights.length>1){weights.sort((a,b)=>a-b);const x=weights.shift()+weights.shift();sum+=x;weights.push(x);}v=sum;break;}case'distance':v=[...c.a].filter((x,i)=>x!==c.b[i]).length;break;case'detect':v=c.d-1;break;case'correct':v=Math.floor((c.d-1)/2);break;case'snr':v=10**(c.db/10);break;case'capacity':v=c.b*Math.log2(1+c.snr);break;case'inverse':v=2**(c.c/c.b)-1;break;}assert(Math.abs(v-c.value)<1e-10,q.key);}
assert(!run('QuizStore.validBackup({version:2})'));assert(run('QuizStore.validBackup(progressRoot)'));
// Review is a rendering-only mode: bank stays collapsed; completed results open in-card.
const reviewApp=app();
for(const subject of ['history','ai','information']){
 reviewApp.run(`openSubject("${subject}");go('bank');`);
 const bankHTML=reviewApp.run('bankList(filtered())');
 assert(!bankHTML.includes('review-comparison'),'ordinary bank has no previous-answer strip');
 assert(!/class="bank-answer" open/.test(bankHTML),'ordinary bank answers stay collapsed, including Array.map calls');
 reviewApp.run(`var reviewPool=CORE.filter(q=>isGradable(q));var reviewWrong=reviewPool.find(q=>q.options.length>acceptedAnswers(q).length);var reviewRight=reviewPool.find(q=>q.key!==reviewWrong.key);var reviewBlank=reviewPool.find(q=>q.key!==reviewWrong.key&&q.key!==reviewRight.key);var reviewPending=CORE.find(q=>!isGradable(q));mode='exam';order='original';start([reviewWrong,reviewRight,reviewBlank,...(reviewPending?[reviewPending]:[])]);selectAnswer('ABCD'.split('').find(a=>reviewWrong.options['ABCD'.indexOf(a)]&&!isCorrect(reviewWrong,a)));moveQuestion(1);selectAnswer(acceptedAnswers(reviewRight)[0]);finish();resultFilter='wrong';`);
 const wrongHTML=reviewApp.run('resultPage()'),cards=wrongHTML.match(/<article[^>]*class="bankitem review-question"[\s\S]*?<\/article>/g)||[];
 assert.equal(cards.length,2);
 for(const card of cards){assert(card.includes('class="review-comparison is-wrong"'));assert(card.includes('Bạn chọn'));assert(card.includes('Đáp án tham khảo'));assert(card.includes('class="bank-answer" open'));assert(card.includes('GIẢI THÍCH & CÁCH NHỚ'));}
 assert(!/<p class="micro">Bạn chọn/.test(wrongHTML));assert(wrongHTML.includes('review-tag chosen'));assert(wrongHTML.includes('review-tag accepted'));
 reviewApp.run("resultFilter='all'");assert(reviewApp.run('resultPage()').includes('review-comparison is-correct'));
 if(reviewApp.run('!!reviewPending')){reviewApp.run("resultFilter='pending'");const pending=reviewApp.run('resultPage()');assert(pending.includes('Chưa có đáp án duy nhất'));assert(pending.includes('class="bank-answer" open'));assert(!pending.includes('review-tag accepted'));}
}
console.log('PASS: shared schemas/counts, legacy migration/idempotence, cross-subject routing/bookmarks/sessions, 115-question timed exam with delayed feedback, two-option safety, full pending/multiple-answer grading, timed auto-submit, filtered retries, numerical practice recomputation and reload preservation.');
