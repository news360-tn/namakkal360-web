/** GET /img/<story id>/<n>  - the website's own copy of a story's picture (kept in the database; cached for a year) */
import type { APIRoute } from "astro";
import { env } from "cloudflare:workers";

export const GET: APIRoute = async ({ params }) => {
  const id = String(params.id ?? ""), n = Number(params.n);
  if (!/^([A-Z]{2,4}-)?[A-Z]{1,4}-\d{1,7}$/.test(id) || !Number.isInteger(n) || n < 0 || n > 2) return new Response("Not found", { status: 404 });
  let row: { b64: string } | null = null;
  try { row = await ((env as any).DB as D1Database).prepare("SELECT b64 FROM news_thumb WHERE id = ? AND n = ?").bind(id, n).first<{ b64: string }>(); } catch { /* table not created yet */ }
  if (!row) return new Response("Not found", { status: 404 });
  const bin = atob(row.b64), bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  const type = row.b64.startsWith("/9j/") ? "image/jpeg" : row.b64.startsWith("iVBOR") ? "image/png" : "image/webp";
  return new Response(bytes, { headers: { "content-type": type, "cache-control": "public, max-age=31536000, immutable", "x-content-type-options": "nosniff" } });
};
