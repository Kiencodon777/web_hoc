const { Pool } = require('pg');
const fs = require('node:fs');
const path = require('node:path');
async function main() {
  if (!process.env.DATABASE_URL) throw Error('DATABASE_URL is required.');
  const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: true }, max: 1 });
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const directory = path.join(__dirname, '../supabase/migrations');
    for (const file of fs.readdirSync(directory).filter(f => f.endsWith('.sql')).sort())
      await client.query(fs.readFileSync(path.join(directory,file),'utf8'));
    await client.query('COMMIT');
    console.log('PostgreSQL schema ready.');
  } catch (error) { await client.query('ROLLBACK'); throw error; }
  finally { client.release(); await pool.end(); }
}
main().catch(() => { console.error('Migration failed. Check DATABASE_URL and project permissions.'); process.exitCode = 1; });
