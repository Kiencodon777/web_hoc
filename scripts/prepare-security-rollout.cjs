const fs=require('node:fs'),path=require('node:path');
const hours=Number(process.argv[2]||48);
if(!Number.isFinite(hours)||hours<1||hours>168)throw Error('Chọn thời gian chuyển tiếp từ 1 đến 168 giờ.');
const root=path.resolve(__dirname,'..'),config=JSON.parse(fs.readFileSync(path.join(root,'wrangler.jsonc'),'utf8'));
config.vars.AUTH_LEGACY_UNTIL=new Date(Date.now()+hours*3600000).toISOString();
config.main=path.resolve(root,config.main);config.assets.directory=path.resolve(root,config.assets.directory);
const file=path.join(root,'build','security-rollout','wrangler.jsonc');fs.mkdirSync(path.dirname(file),{recursive:true});fs.writeFileSync(file,JSON.stringify(config,null,2)+'\n');
console.log(JSON.stringify({config:file,legacyEndsUTC:config.vars.AUTH_LEGACY_UNTIL,deployed:false}));
