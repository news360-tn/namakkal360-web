/** owner 26 Nov: the public address is news360-tn.pages.dev (Astro "site"); canonical links, sitemaps and shared links use it even
 *  when a page is served through the worker's own workers.dev address. */
export const SITE = (import.meta.env.SITE as string | undefined)?.replace(/\/$/, "") || "";
export const siteOrigin = (u: URL) => SITE || u.origin;
