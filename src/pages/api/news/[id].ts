/** GET /api/news/RN-140 -> one story */
import type { APIRoute } from "astro";
import { env } from "cloudflare:workers";
import { get } from "../../../lib/news";

export const GET: APIRoute = async ({ params }) => {
  const n = await get((env as any).DB as D1Database, params.id ?? "");
  return n ? Response.json(n, { headers: { "access-control-allow-origin": "*", "cache-control": "public, max-age=300" } })
           : Response.json({ error: "not found" }, { status: 404 });
};
