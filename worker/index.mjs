import { AsyncLocalStorage } from 'node:async_hooks';
import { env } from 'cloudflare:workers';
import { httpServerHandler } from 'cloudflare:node';
import appModule from '../server/app.cjs';
import postgresModule from '../server/postgres.cjs';
import domainRouting from '../server/domain-routing.cjs';
import domainHandoff from '../server/domain-handoff.cjs';
import operations from '../server/operations.cjs';
import securityMaintenance from '../server/security-maintenance.cjs';
import {routeBattle} from '../battle/router.mjs';
export {BattleRoom} from '../battle/room.mjs';

// TCP connections belong to a request in Workers, not to a global isolate.
const requests = new AsyncLocalStorage();
const db = {
  asyncStorage: true,
  prepare: (...args) => requests.getStore().prepare(...args),
  transaction: (...args) => requests.getStore().transaction(...args)
};
function rateLimitStore(identifier) {
  const prefix = `api-v2:${identifier}:`;
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
  async scheduled(controller,bindings,ctx){
    const store=postgresModule.openHyperdrive(bindings.HYPERDRIVE);
    try{await securityMaintenance.securityMaintenance(store,bindings);await store.purgeHandoffs(Date.now());if(bindings.TELEMETRY_ENABLED==='true')await operations.pruneOperations(store,Date.now());}finally{ctx.waitUntil(store.close());}
  },
  async fetch(request, bindings, ctx) {
    const incomingURL=new URL(request.url);
    if(bindings.ADMIN_ORIGIN&&incomingURL.origin===bindings.ADMIN_ORIGIN&&!operations.adminPathAllowed(incomingURL.pathname)){
      if(incomingURL.pathname==='/')return Response.redirect(incomingURL.origin+'/ops/login',302);
      return new Response('Not found',{status:404,headers:{'Cache-Control':'no-store'}});
    }
    if(incomingURL.pathname==='/pk-config.js')return new Response('window.PK_CONFIG='+JSON.stringify({enabled:bindings.PK_ENABLED==='true',preview:false})+';',{headers:{'Content-Type':'text/javascript','Cache-Control':'no-store'}});
    if(incomingURL.pathname.startsWith('/api/pk/')&&bindings.PK_ENABLED!=='true')return new Response('Not found',{status:404});
    if(incomingURL.pathname.startsWith('/api/pk/')){const store=postgresModule.openHyperdrive(bindings.HYPERDRIVE);try{return await routeBattle(request,bindings,store);}finally{ctx.waitUntil(store.close());}}
    if(new URL(request.url).pathname.startsWith('/api/domain-transfer/')){
      const store=postgresModule.openHyperdrive(bindings.HYPERDRIVE);
      try{return await domainHandoff.handleHandoff(request,bindings,store,request.headers.get('CF-Connecting-IP')||'unknown');}
      finally{ctx.waitUntil(store.close());}
    }
    const isAdminHost=bindings.ADMIN_ORIGIN&&new URL(request.url).origin===bindings.ADMIN_ORIGIN;
    const migration = isAdminHost?null:await domainRouting.handleDomainRouting(request, bindings);
    if(migration)return migration;
    const url = new URL(request.url);
    if (!url.pathname.startsWith('/api/') && url.pathname!=='/ops' && !url.pathname.startsWith('/ops/')) {const asset=await bindings.ASSETS.fetch(request);if(bindings.PK_ENABLED!=='true')return asset;const headers=new Headers(asset.headers);headers.set('Permissions-Policy','camera=(), microphone=(self), geolocation=()');headers.set('Content-Security-Policy',"default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; style-src-elem 'self' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; img-src 'self' data: blob:; connect-src 'self' wss://"+url.host+"; media-src 'self' blob:; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'");return new Response(asset.body,{status:asset.status,headers});}
    const ip = request.headers.get('CF-Connecting-IP') || '127.0.0.1';
    if(url.pathname==='/api/progress'&&bindings.PROGRESS_LIMITER){const result=await bindings.PROGRESS_LIMITER.limit({key:ip});if(!result.success)return Response.json({error:'Đồng bộ quá nhanh.'},{status:429,headers:{'Retry-After':'60','Cache-Control':'no-store'}});}
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
    const store = postgresModule.openHyperdrive(bindings.HYPERDRIVE);
    try { return await requests.run(store, () => handler.fetch(forwarded, bindings, ctx)); }
    finally { ctx.waitUntil(store.close()); }
  }
};
