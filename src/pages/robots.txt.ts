/** robots.txt: everything open except the private pipeline door; sitemaps listed */
import type { APIRoute } from "astro";
import { siteOrigin, isDirectWorker } from "../lib/site";
export const GET: APIRoute = ({ url, request }) => new Response(
  // the worker's own workers.dev address is a duplicate of the public site: nothing there is to be indexed
  isDirectWorker(request) ? `User-agent: *\nDisallow: /\n`
  : `User-agent: *\nAllow: /\nDisallow: /api/ingest\nDisallow: /api/links\nDisallow: /api/thumbs\n\nSitemap: ${siteOrigin(url)}/sitemap.xml\nSitemap: ${siteOrigin(url)}/news-sitemap.xml\n`,
  { headers: { "content-type": "text/plain; charset=utf-8", "cache-control": "public, max-age=3600" } });
