// Managed internal preview only: real API, isolated DB, email disabled without a key.
// Production uses server/index.cjs and requires an explicitly configured secret.
const crypto=require('node:crypto');
const portIndex=process.argv.indexOf('--port');if(portIndex>=0)process.env.PORT=process.argv[portIndex+1];
process.env.JWT_SECRET ||= crypto.randomBytes(48).toString('hex');
process.env.DATABASE_PATH ||= './data/preview.sqlite';
process.env.APP_ORIGINS ||= 'http://terminal.local:4173';
require('./index.cjs');
