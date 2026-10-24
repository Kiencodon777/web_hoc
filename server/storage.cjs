// Both adapters expose the same asynchronous interface. A transaction receives
// its own connection, so awaiting SQL never lets another request join it.
function sqliteStorage(raw) {
  let tail = Promise.resolve();
  const serial = fn => {
    const result = tail.then(fn);
    tail = result.catch(() => {});
    return result;
  };
  return {
    prepare(sql) {
      return Object.fromEntries(['get', 'run', 'all'].map(method =>
        [method, (...args) => serial(() => raw.prepare(sql)[method](...args))]));
    },
    transaction(fn) {
      return serial(async () => {
        raw.exec('BEGIN IMMEDIATE');
        try { const result = await fn(raw); raw.exec('COMMIT'); return result; }
        catch (error) { raw.exec('ROLLBACK'); throw error; }
      });
    },
    close: () => serial(() => raw.close()),
    asyncStorage: true
  };
}
module.exports = { sqliteStorage };
