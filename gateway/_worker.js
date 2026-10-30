// Pages provides the custom hostname while ZoneDNS remains authoritative.
// Keep the original URL/Origin so auth and browser storage use one public host.
export default {
  fetch(request, env) { return env.KIENHOC.fetch(request); }
};
