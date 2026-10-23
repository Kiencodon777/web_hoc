import { AsyncLocalStorage } from 'node:async_hooks';
import { env } from 'cloudflare:workers';
import { httpServerHandler } from 'cloudflare:node';
import appModule from '../server/app.cjs';
import postgresModule from '../server/postgres.cjs';

// TCP connections belong to a request in Workers, not to a global isolate.
const requests = new AsyncLocalStorage();
const db = {
  asyncStorage: true,
  prepare: (...args) => requests.getStore().prepare(...args),
  transaction: (...args) => requests.getStore().transaction(...args)
};
let limiterId = 0;
function rateLimitStore() {
  const prefix = `api:${limiterId++}:`;
  return {
    init(options) { this.windowMs = options.windowMs; },
    increment(key) { return requests.getStore().consumeRate(prefix+key, this.windowMs); },
    decrement(key) { return requests.getStore().decrementRate(prefix+key); },
    resetKey(key) { return requests.getStore().resetRate(prefix+key); }
  };
}
const { app } = appModule.createApp({ db, config: env, static: false, rateLimitStore });
app.listen(3000);
const handler = httpServerHandler({ port: 3000 });

export default {
  async fetch(request, bindings, ctx) {
    const url = new URL(request.url);
    if (!url.pathname.startsWith('/api/')) return bindings.ASSETS.fetch(request);
    const ip = request.headers.get('CF-Connecting-IP') || '127.0.0.1';
    if (url.pathname.startsWith('/api/auth/') && bindings.AUTH_LIMITER) {
      const result = await bindings.AUTH_LIMITER.limit({ key: ip });
      if (!result.success) return Response.json({ error: 'Quá nhiều yêu cầu. Thử lại sau.' },
        { status: 429, headers: { 'Retry-After': '60', 'Cache-Control': 'no-store' } });
    }
    // Trust only the client IP provided by Cloudflare, not incoming proxy headers.
    const headers = new Headers(request.headers);
    headers.set('X-Forwarded-For', ip);
    headers.delete('Forwarded');
    const forwarded = new Request(request, { headers });
    const store = postgresModule.openPostgres(bindings.DATABASE_URL);
    try { return await requests.run(store, () => handler.fetch(forwarded, bindings, ctx)); }
    finally { ctx.waitUntil(store.close()); }
  }
};
