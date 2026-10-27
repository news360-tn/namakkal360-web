/** sitemap.xml: home, the 8 taluk pages and every story, each with its Tamil and English address */
import type { APIRoute } from "astro";
import { env } from "cloudflare:workers";
import { TALUKS } from "../lib/geo";

const x = (s: string) => s.replace(/&/g, "&amp;");
function entry(loc: string, lastmod?: string) {
  const en = loc + (loc.includes("?") ? "&" : "?") + "lang=en";
  return `<url><loc>${x(loc)}</loc>${lastmod ? `<lastmod>${lastmod}</lastmod>` : ""}`
    + `<xhtml:link rel="alternate" hreflang="ta" href="${x(loc)}"/><xhtml:link rel="alternate" hreflang="en" href="${x(en)}"/></url>`;
}
export const GET: APIRoute = async ({ url }) => {
  const o = url.origin;
  const rows = await ((env as any).DB as D1Database).prepare("SELECT id, day, updated_at FROM news ORDER BY day DESC, time DESC LIMIT 45000").all<{ id: string; day: string; updated_at: string }>();
  const body = [entry(`${o}/`), ...TALUKS.map((t) => entry(`${o}/?taluk=${t.id}`)),
    ...(rows.results ?? []).map((r) => entry(`${o}/news/${encodeURIComponent(r.id)}`, (r.updated_at || r.day).slice(0, 10)))].join("");
  return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">${body}</urlset>`,
    { headers: { "content-type": "application/xml; charset=utf-8", "cache-control": "public, max-age=900" } });
};
