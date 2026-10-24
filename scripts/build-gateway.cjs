const fs = require('node:fs'), path = require('node:path');
const root = path.join(__dirname,'..');
const output = path.join(root,'build/gateway');
fs.mkdirSync(output,{recursive:true});
fs.copyFileSync(path.join(root,'gateway/_worker.js'),path.join(output,'_worker.js'));
fs.writeFileSync(path.join(output,'_routes.json'),JSON.stringify({version:1,include:['/*'],exclude:[]}));
fs.writeFileSync(path.join(output,'index.html'),'<!doctype html><html lang="vi"><meta charset="utf-8"><title>Kiến Học</title><p>Đang kết nối không gian học tập.</p></html>');
console.log('Pages gateway prepared.');
