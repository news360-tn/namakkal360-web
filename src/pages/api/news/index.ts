/** GET /api/news?taluk=&place=&type=&date=&q=&page=&lang=&format=html
 *  One API for the website, the app and anything later. */
import type { APIRoute } from "astro";
import { env } from "cloudflare:workers";
import { list, sanitize, PAGE } from "../../../lib/news";
import { cardHtml } from "../../../lib/card";
import { langOf } from "../../../lib/i18n";

export const GET: APIRoute = async ({ url }) => {
  const sp = url.searchParams, f = sanitize(Object.fromEntries(sp)), lang = langOf(sp.get("lang"));
  const { items, total } = await list((env as any).DB as D1Database, f);
  const more = ((f.page ?? 0) + 1) * PAGE < total;
  const body = sp.get("format") === "html"
    ? { html: items.filter((n) => n.type !== "power" || f.type === "power").map((n) => cardHtml(n, lang)).join(""), more }
    : { items, total, page: f.page, more };
  return Response.json(body, { headers: { "access-control-allow-origin": "*", "cache-control": "public, max-age=60" } });
};
