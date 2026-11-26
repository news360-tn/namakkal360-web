/** robots.txt: everything open except the private pipeline door; sitemaps listed */
import type { APIRoute } from "astro";
import { siteOrigin } from "../lib/site";
export const GET: APIRoute = ({ url }) => new Response(
  `User-agent: *\nAllow: /\nDisallow: /api/ingest\nDisallow: /api/links\nDisallow: /api/thumbs\n\nSitemap: ${siteOrigin(url)}/sitemap.xml\nSitemap: ${siteOrigin(url)}/news-sitemap.xml\n`,
  { headers: { "content-type": "text/plain; charset=utf-8", "cache-control": "public, max-age=3600" } });
