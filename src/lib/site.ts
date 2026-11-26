/** owner 26 Nov: the public address is news360-tn.pages.dev (Astro "site"); canonical links, sitemaps and shared links use it even
 *  when a page is served through the worker's own workers.dev address. */
export const SITE = (import.meta.env.SITE as string | undefined)?.replace(/\/$/, "") || "";
export const siteOrigin = (u: URL) => SITE || u.origin;

/** owner 26 Nov (SEO): the worker's own address (www.namakkal360.workers.dev) is a duplicate of the public site - it must not be indexed.
 *  A request that came through the public Pages address carries x-forwarded-host; a direct workers.dev request does not. */
export const isDirectWorker = (req: Request) => /\.workers\.dev$/.test(new URL(req.url).hostname) && !req.headers.get("x-forwarded-host");
