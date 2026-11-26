/** POST /api/links  (Authorization: Bearer <INGEST_KEY>)
 *  owner 26 Nov: the link sync sends each story's Facebook and YouTube links once they are posted:
 *  [{ "id": "CBE-RN-598", "fb_url": "https://www.facebook.com/reel/...", "yt_url": "https://youtube.com/shorts/..." }]
 *  Only those two columns change. */
import type { APIRoute } from "astro";
import { env } from "cloudflare:workers";
import { setLinks, type LinkUpdate } from "../../lib/news";

export const POST: APIRoute = async ({ request }) => {
  const key = (env as any).INGEST_KEY as string | undefined;
  if (!key || (request.headers.get("authorization") ?? "") !== `Bearer ${key}`) return Response.json({ error: "unauthorized" }, { status: 401 });
  let data: unknown;
  try { data = await request.json(); } catch { return Response.json({ error: "bad json" }, { status: 400 }); }
  const items = (Array.isArray(data) ? data : [data]) as LinkUpdate[];
  if (!items.length || items.length > 200) return Response.json({ error: "send 1-200 items" }, { status: 400 });
  return Response.json({ ok: true, ...(await setLinks((env as any).DB as D1Database, items)) });
};
