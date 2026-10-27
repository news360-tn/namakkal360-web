/** POST /api/ingest  (Authorization: Bearer <INGEST_KEY>)
 *  The news pipeline sends each new story here (one story or a list); it is stored at once and shows on the site. */
import type { APIRoute } from "astro";
import { env } from "cloudflare:workers";
import { toRow, upsert, type Incoming } from "../../lib/news";

export const POST: APIRoute = async ({ request }) => {
  const key = (env as any).INGEST_KEY as string | undefined;
  const auth = request.headers.get("authorization") ?? "";
  if (!key || auth !== `Bearer ${key}`) return Response.json({ error: "unauthorized" }, { status: 401 });
  let data: unknown;
  try { data = await request.json(); } catch { return Response.json({ error: "bad json" }, { status: 400 }); }
  const stories = (Array.isArray(data) ? data : [data]) as Incoming[];
  if (!stories.length || stories.length > 50) return Response.json({ error: "send 1-50 stories" }, { status: 400 });
  const saved: string[] = [], skipped: { id: string; why: string }[] = [];
  for (const s of stories) {
    if (!s || typeof s.story_id !== "string" || !/^[A-Z]{1,4}-\d{1,7}$/.test(s.story_id) || typeof s.headline_ta !== "string" || !s.headline_ta.trim()) {
      skipped.push({ id: String((s as any)?.story_id ?? "?"), why: "story_id and headline_ta are required" }); continue;
    }
    await upsert((env as any).DB as D1Database, toRow(s));
    saved.push(s.story_id);
  }
  return Response.json({ ok: true, saved, skipped });
};
