function safeDatabaseError(error, url) {
  let message = String(error?.message || 'Database request failed');
  if (url) {
    message = message.split(url).join('[connection]');
    try {
      const password = new URL(url).password;
      for (const value of [password,decodeURIComponent(password)])
        if(value) message = message.split(value).join('[redacted]');
    } catch {}
  }
  return message.replace(/postgres(?:ql)?:\/\/\S+/gi,'[connection]').slice(0,400);
}
module.exports = { safeDatabaseError };
