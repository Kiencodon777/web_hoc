const fs = require('node:fs');
const Database = require('better-sqlite3');
const { Pool } = require('pg');
const { validProgress } = require('../server/validation.cjs');

async function importSQLite(source, pool) {
  if (!source || !fs.existsSync(source)) throw Error('Provide an existing SQLite backup path.');
  const sqlite = new Database(source, { readonly: true, fileMustExist: true });
  let client;
  try {
    if (sqlite.pragma('integrity_check', { simple: true }) !== 'ok') throw Error('SQLite integrity check failed.');
    const { users, progress } = sqlite.transaction(() => ({
      users: sqlite.prepare('SELECT id,email,password_hash,created_at FROM users').all(),
      progress: sqlite.prepare('SELECT user_id,data,updated_at,revision FROM progress').all()
    }))();
    const ids = new Set(users.map(u => u.id));
    for (const row of progress) {
      if (!ids.has(row.user_id) || !validProgress(JSON.parse(row.data)) || !Number.isInteger(row.revision) || row.revision < 1)
        throw Error('Backup contains invalid progress. Import cancelled.');
    }
    client = await pool.connect();
    await client.query('BEGIN');
    // Initial import only, with writers stopped. Never silently overwrite cloud data.
    await client.query('LOCK TABLE kienhoc.users, kienhoc.progress, kienhoc.sessions, kienhoc.otps IN ACCESS EXCLUSIVE MODE');
    const occupied = await client.query(`SELECT
      (SELECT COUNT(*) FROM kienhoc.users) + (SELECT COUNT(*) FROM kienhoc.progress) +
      (SELECT COUNT(*) FROM kienhoc.sessions) + (SELECT COUNT(*) FROM kienhoc.otps) AS n`);
    if (Number(occupied.rows[0].n)) throw Error('Target database must be empty. No data changed.');
    for (const u of users) await client.query('INSERT INTO kienhoc.users(id,email,password_hash,created_at) VALUES($1,$2,$3,$4)',
      [u.id,u.email,u.password_hash,u.created_at]);
    for (const p of progress) await client.query('INSERT INTO kienhoc.progress(user_id,data,updated_at,revision) VALUES($1,$2,$3,$4)',
      [p.user_id,p.data,p.updated_at,p.revision]);
    const actualUsers = (await client.query('SELECT id,email,password_hash,created_at FROM kienhoc.users ORDER BY id')).rows;
    const actualProgress = (await client.query('SELECT user_id,data,updated_at,revision FROM kienhoc.progress ORDER BY user_id')).rows;
    const assert = require('node:assert/strict');
    assert.deepEqual(new Map(actualUsers.map(u => [u.id,u])), new Map(users.map(u => [u.id,u])));
    // Compare by ID in JS to avoid database collation differences.
    assert.deepEqual(new Map(actualProgress.map(p => [p.user_id,p])), new Map(progress.map(p => [p.user_id,p])));
    await client.query('COMMIT');
    return { users: users.length, progress: progress.length };
  } catch (error) {
    if (client) await client.query('ROLLBACK');
    throw error;
  } finally { client?.release(); sqlite.close(); }
}
if (require.main === module) {
  if (!process.env.DATABASE_URL) throw Error('Set DATABASE_URL in your local .env.');
  const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: true }, max: 1 });
  importSQLite(process.argv[2], pool).then(counts => console.log('Verified import:', counts))
    .catch(() => { console.error('Import failed; transaction rolled back. Check the backup and empty target.'); process.exitCode = 1; })
    .finally(() => pool.end());
}
module.exports = { importSQLite };
