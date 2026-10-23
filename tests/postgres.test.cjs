const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const request = require('supertest');
const { PGlite } = require('@electric-sql/pglite');
const { postgresStorage } = require('../server/postgres.cjs');
const { createApp } = require('../server/app.cjs');
const { blank } = require('../dist/progress-merge.js');
const { importSQLite } = require('../scripts/import-sqlite.cjs');
const { openDatabase } = require('../server/database.cjs');

// PGlite runs real PostgreSQL SQL in WASM. A single-session pool serializes
// clients; cross-server advisory locking still requires live Supabase testing.
async function fixture() {
  const engine = new PGlite();
  const directory = path.join(__dirname,'../supabase/migrations');
  for (const file of fs.readdirSync(directory).filter(f => f.endsWith('.sql')).sort())
    await engine.exec(fs.readFileSync(path.join(directory,file),'utf8'));
  let tail = Promise.resolve();
  async function acquire() {
    let release;
    const previous = tail;
    tail = new Promise(resolve => { release = resolve; });
    await previous;
    return release;
  }
  const query = async (sql,args) => {
    const r = await engine.query(sql,args);
    return { ...r, rowCount: r.affectedRows };
  };
  const pool = {
    async query(sql,args) { const release = await acquire(); try { return await query(sql,args); } finally { release(); } },
    async connect() { const release = await acquire(); return { query, release }; },
    end: () => engine.close()
  };
  const db = postgresStorage(pool), emails = [];
  const config = { JWT_SECRET: 'test-only-'+'s'.repeat(48), NODE_ENV:'test' };
  const { app } = createApp({ db, config, sendMail: async(email,code) => emails.push({email,code}) });
  const api = request(app);
  async function login(email) {
    await api.post('/api/auth/send-otp').send({ email }).expect(200);
    const code = emails.at(-1).code;
    const r = await api.post('/api/auth/verify-otp').send({email,code,remember:true}).expect(200);
    await api.post('/api/auth/verify-otp').send({email,code}).expect(401);
    return r.body;
  }
  return { api, db, pool, login, emails };
}

test('PostgreSQL API: OTP, password, isolation, simultaneous first writes and logout', async () => {
  const s = await fixture();
  try {
    const a = await s.login('pg-a@example.com'), b = await s.login('pg-b@example.com');
    const auth = 'Bearer '+a.token, password = 'Postgres-test-only-123';
    assert.equal((await s.db.consumeRate('test-ip',60000)).totalHits,1);
    assert.equal((await s.db.consumeRate('test-ip',60000)).totalHits,2);
    await s.db.resetRate('test-ip');
    assert.equal((await s.db.consumeRate('test-ip',60000)).totalHits,1);
    await s.api.post('/api/auth/send-otp').send({email:a.user.email}).expect(429);
    await s.api.post('/api/auth/set-password').set('Authorization',auth).send({password}).expect(200);
    const p = await s.api.post('/api/auth/password-login').send({email:a.user.email,password}).expect(200);
    await s.api.post('/api/auth/set-password').set('Authorization',auth).send({password:'Reset-test-only-123'}).expect(200);
    await s.api.get('/api/auth/me').set('Authorization','Bearer '+p.body.token).expect(401);
    const write = () => s.api.post('/api/progress').set('Authorization',auth).send({progressData:blank(),expectedRevision:0});
    const results = await Promise.all([write(),write()]);
    assert.deepEqual(results.map(r => r.status).sort(),[200,409]);
    const other = await s.api.get('/api/progress').set('Authorization','Bearer '+b.token).expect(200);
    assert.equal(other.body.progressData,null);
    await s.api.post('/api/auth/logout').set('Authorization',auth).send({}).expect(200);
    await s.api.get('/api/progress').set('Authorization',auth).expect(401);
  } finally { await s.db.close(); }
});

test('SQLite import preserves IDs, bcrypt hashes and progress; populated target is unchanged', async () => {
  const s = await fixture(), dir = fs.mkdtempSync(path.join(os.tmpdir(),'kienhoc-import-'));
  const source = path.join(dir,'backup.sqlite');
  const old = openDatabase(source);
  const bcrypt = require('bcryptjs'), hash = await bcrypt.hash('Original-password-123',12);
  old.prepare('INSERT INTO users VALUES(?,?,?,?)').run('old-id','old@example.com',hash,'2026-01-01T00:00:00.000Z');
  old.prepare('INSERT INTO progress VALUES(?,?,?,?)').run('old-id',JSON.stringify(blank()),'2026-01-01T00:00:00.000Z',7);
  old.close();
  try {
    assert.deepEqual(await importSQLite(source,s.pool),{users:1,progress:1});
    const r = await s.api.post('/api/auth/password-login').send({email:'old@example.com',password:'Original-password-123'}).expect(200);
    assert.equal(r.body.user.id,'old-id');
    const progress = await s.api.get('/api/progress').set('Authorization','Bearer '+r.body.token).expect(200);
    assert.equal(progress.body.revision,7);
    await assert.rejects(importSQLite(source,s.pool),/must be empty/);
    assert.equal((await s.pool.query('SELECT COUNT(*) AS n FROM kienhoc.users')).rows[0].n,1);
    assert.equal((await s.pool.query('SELECT revision FROM kienhoc.progress')).rows[0].revision,7);
  } finally { await s.db.close(); fs.rmSync(dir,{recursive:true,force:true}); }
});
