/** Google News sitemap: stories of the last 2 days (Google News reads only recent articles) */
import type { APIRoute } from "astro";
import { env } from "cloudflare:workers";
import { istDay } from "../lib/news";

const x = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&apos;" })[c]!);
export const GET: APIRoute = async ({ url }) => {
  const rows = await ((env as any).DB as D1Database).prepare("SELECT id, day, time, title_ta FROM news WHERE day >= ? ORDER BY day DESC, time DESC LIMIT 1000")
    .bind(istDay(-1)).all<{ id: string; day: string; time: string; title_ta: string }>();
  const items = (rows.results ?? []).map((r) => `<url><loc>${url.origin}/news/${encodeURIComponent(r.id)}</loc><news:news><news:publication><news:name>Namakkal 360</news:name><news:language>ta</news:language></news:publication><news:publication_date>${r.day}T${r.time || "00:00"}:00+05:30</news:publication_date><news:title>${x(r.title_ta)}</news:title></news:news></url>`).join("");
  return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">${items}</urlset>`,
    { headers: { "content-type": "application/xml; charset=utf-8", "cache-control": "public, max-age=300" } });
};
