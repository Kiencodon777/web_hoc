const fs = require('node:fs');
const crypto = require('node:crypto');
if (fs.existsSync('.env')) {
  console.log('Existing .env preserved.');
} else {
  let config = fs.readFileSync('.env.example','utf8');
  config = config.replace(/^JWT_SECRET=.*$/m, 'JWT_SECRET='+crypto.randomBytes(48).toString('hex'));
  config = config.replace(/^APP_ORIGINS=.*$/m, 'APP_ORIGINS=http://localhost:3000,http://127.0.0.1:3000');
  fs.writeFileSync('.env',config,{mode:0o600,flag:'wx'});
  console.log('Created local .env with a random JWT secret. Email needs Resend configuration.');
}
