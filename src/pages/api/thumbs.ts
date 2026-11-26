/** POST /api/thumbs  (Authorization: Bearer <INGEST_KEY>)
 *  owner 26 Nov: the picture sync sends small copies of each story's pictures so they never depend on the pipeline's
 *  24-hour picture links:  [{ "id": "CBE-RN-598", "thumbs": ["<base64 webp>", ...] }]   (1-20 stories, 3 pictures each at most) */
import type { APIRoute } from "astro";
import { env } from "cloudflare:workers";
import { saveThumbs, type ThumbUpdate } from "../../lib/news";

export const POST: APIRoute = async ({ request }) => {
  const key = (env as any).INGEST_KEY as string | undefined;
  if (!key || (request.headers.get("authorization") ?? "") !== `Bearer ${key}`) return Response.json({ error: "unauthorized" }, { status: 401 });
  let data: unknown;
  try { data = await request.json(); } catch { return Response.json({ error: "bad json" }, { status: 400 }); }
  const items = (Array.isArray(data) ? data : [data]) as ThumbUpdate[];
  if (!items.length || items.length > 20) return Response.json({ error: "send 1-20 stories" }, { status: 400 });
  return Response.json({ ok: true, ...(await saveThumbs((env as any).DB as D1Database, items)) });
};
