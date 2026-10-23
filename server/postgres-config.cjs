const supabaseCA = require('./supabase-ca.cjs');

function postgresConfig(connectionString) {
  const url = new URL(connectionString);
  // pg-connection-string SSL query parameters override the explicit ssl object.
  // Keep the application's CA and verification policy authoritative.
  for (const key of ['sslmode','sslrootcert','sslcert','sslkey','ssl','uselibpqcompat'])
    url.searchParams.delete(key);
  const supabase = url.hostname.endsWith('.pooler.supabase.com') ||
    /^db\.[a-z0-9]+\.supabase\.co$/.test(url.hostname);
  return {
    connectionString: url.toString(),
    ssl: { rejectUnauthorized: true, ...(supabase ? { ca: supabaseCA } : {}) }
  };
}
module.exports = { postgresConfig };
