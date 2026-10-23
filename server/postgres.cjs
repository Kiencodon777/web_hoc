const { Pool } = require('pg');
const { postgresConfig } = require('./postgres-config.cjs');

// Only application-owned SQL templates pass through this adapter; values always
// remain parameters. Never accept SQL templates from an HTTP request.
function postgresSQL(sql) {
  let n = 0;
  let query = sql.replace(/\?/g, () => '$' + (++n));
  if (query.startsWith('INSERT OR IGNORE INTO users')) {
    query = query.replace('INSERT OR IGNORE', 'INSERT') + ' ON CONFLICT(email) DO NOTHING';
  }
  if (query.startsWith('INSERT INTO otps(')) query += ' RETURNING id';
  return query.replace(/\b(users|otps|sessions|progress)\b/g, 'kienhoc.$1');
}

function postgresStorage(pool) {
  const connection = client => ({
    prepare(sql) {
      const execute = async args => {
        const result = await client.query(postgresSQL(sql), args);
        // BIGINT epochs and COUNT arrive as strings from node-postgres.
        for (const row of result.rows) for (const key of ['expires_at', 'created_at', 'n']) {
          if (typeof row[key] === 'string' && /^\d+$/.test(row[key])) row[key] = Number(row[key]);
        }
        return result;
      };
      return {
        get: async (...args) => (await execute(args)).rows[0],
        all: async (...args) => (await execute(args)).rows,
        run: async (...args) => {
          const r = await execute(args);
          return { changes: r.rowCount, lastInsertRowid: r.rows[0]?.id };
        }
      };
    }
  });
  return {
    ...connection(pool),
    asyncStorage: true,
    async consumeRate(key, windowMs) {
      const now = Date.now();
      await pool.query('DELETE FROM kienhoc.rate_limits WHERE reset_at < $1', [now]);
      const r = await pool.query(`INSERT INTO kienhoc.rate_limits(key,hits,reset_at) VALUES($1,1,$2)
        ON CONFLICT(key) DO UPDATE SET
        hits=CASE WHEN kienhoc.rate_limits.reset_at <= $3 THEN 1 ELSE kienhoc.rate_limits.hits+1 END,
        reset_at=CASE WHEN kienhoc.rate_limits.reset_at <= $3 THEN $2 ELSE kienhoc.rate_limits.reset_at END
        RETURNING hits,reset_at`, [key,now+windowMs,now]);
      return { totalHits: r.rows[0].hits, resetTime: new Date(Number(r.rows[0].reset_at)) };
    },
    decrementRate: key => pool.query('UPDATE kienhoc.rate_limits SET hits=GREATEST(0,hits-1) WHERE key=$1',[key]),
    resetRate: key => pool.query('DELETE FROM kienhoc.rate_limits WHERE key=$1',[key]),
    async transaction(fn, key) {
      const client = await pool.connect();
      try {
        await client.query('BEGIN');
        // Locks work across Worker instances, including for a user's first write.
        await client.query('SELECT pg_advisory_xact_lock(hashtextextended($1,0))', [key]);
        const result = await fn(connection(client));
        await client.query('COMMIT');
        return result;
      } catch (error) { await client.query('ROLLBACK'); throw error; }
      finally { client.release(); }
    },
    close: () => pool.end()
  };
}

function openPostgres(url) {
  if (!url) throw Error('DATABASE_URL is required.');
  const pool = new Pool({ ...postgresConfig(url), max: 2, connectionTimeoutMillis: 10000,
    idleTimeoutMillis: 1000 });
  pool.on('error', () => console.error('PostgreSQL idle connection failed.'));
  return postgresStorage(pool);
}
module.exports = { openPostgres, postgresStorage, postgresSQL };
