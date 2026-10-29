const fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const ctx=vm.createContext({window:{},document:{addEventListener(){}},localStorage:{getItem(){return null}},console});
for(const file of ['data.js','ai-questions.js','ai-answers.js','information-questions.js','academy.js','question-sources.js','info-questions.js','ai-hints.js','quiz-data.js'])vm.runInContext(fs.readFileSync(path.join(__dirname,'../dist',file),'utf8'),ctx,{filename:file});
const bank=JSON.parse(vm.runInContext('JSON.stringify(QUIZ_DATA)',ctx));
for(const subject of Object.keys(bank))bank[subject]=bank[subject].filter(q=>!q.extra&&!q.review&&q.answers?.length===1).map(q=>({key:q.key,question:q.question,options:q.options,answers:q.answers,explanation:q.explanation||'',review:false}));
fs.writeFileSync(path.join(__dirname,'../battle/bank.json'),JSON.stringify(bank));console.log('Battle bank:',Object.fromEntries(Object.entries(bank).map(([k,v])=>[k,v.length])));
