/**
 * News360 public address: news360.pages.dev  (Cloudflare Pages, free plan).
 * owner 26 Nov: the website itself is the Astro worker "www" (database, pages, news API). This small Pages site only puts the
 * news360.pages.dev address in front of it - every request goes to that worker unchanged and the answer comes straight back.
 * It keeps no data and no secrets. The link to the worker is a "service binding" (WWW, see wrangler.jsonc next to this file);
 * if the binding is missing it uses the worker's own public address.
 */
const UPSTREAM = "https://www.namakkal360.workers.dev";

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const upstream = new Request(UPSTREAM + url.pathname + url.search, request);
    upstream.headers.set("x-forwarded-host", url.host);
    const res = env.WWW ? await env.WWW.fetch(upstream) : await fetch(upstream);
    // a redirect that names the worker's own address is sent back to this address
    const loc = res.headers.get("location");
    if (loc && loc.startsWith(UPSTREAM)) {
      const h = new Headers(res.headers);
      h.set("location", url.origin + loc.slice(UPSTREAM.length));
      return new Response(res.body, { status: res.status, headers: h });
    }
    return res;
  },
};
