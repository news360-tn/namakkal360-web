/** Reading and writing stories in the D1 news store. */
import { clean, dropOutro, factsFromCaption } from "./text";
import { typeFromCategory, TYPES } from "./types";
import { locate, TALUKS } from "./geo";
import { powerHours } from "./power";

export interface News {
  id: string; day: string; time: string; taluk: string; place: string; type: string;
  title_ta: string; title_en: string; body_ta: string; body_en: string;
  facts: { label: string; value: string }[]; images: string[]; reel_url: string; source_url: string;
  power_from: number | null; power_to: number | null;
}
export interface Filter { taluk?: string; place?: string; type?: string; date?: string; q?: string; page?: number }
export const PAGE = 15;      // news per page

/** today in India (IST), YYYY-MM-DD */
export const istDay = (offsetDays = 0, now = Date.now()) => new Date(now + 5.5 * 3600e3 + offsetDays * 864e5).toISOString().slice(0, 10);

/** only known values reach the database query */
export function sanitize(f: Record<string, string | null | undefined>): Filter {
  const tk = TALUKS.find((t) => t.id === f.taluk);
  return {
    taluk: tk?.id,
    place: tk?.places.find((p) => p.id === f.place)?.id,
    type: TYPES.find((t) => t.id === f.type)?.id,
    date: /^(today|yesterday|week|\d{4}-\d{2}-\d{2})$/.test(f.date ?? "") ? f.date! : undefined,
    q: (f.q ?? "").trim().slice(0, 60) || undefined,
    page: Math.max(0, Math.min(200, parseInt(f.page ?? "0", 10) || 0)),
  };
}

export function whereOf(f: Filter, now = Date.now()): { sql: string; args: (string | number)[] } {
  const w: string[] = [], a: (string | number)[] = [];
  if (f.taluk) { w.push("taluk = ?"); a.push(f.taluk); }
  if (f.place) { w.push("place = ?"); a.push(f.place); }
  if (f.type) { w.push("type = ?"); a.push(f.type); }
  if (f.date === "today") { w.push("day = ?"); a.push(istDay(0, now)); }
  else if (f.date === "yesterday") { w.push("day = ?"); a.push(istDay(-1, now)); }
  else if (f.date === "week") { w.push("day >= ?"); a.push(istDay(-6, now)); }
  else if (f.date) { w.push("day = ?"); a.push(f.date); }
  if (f.q) { w.push("(title_ta LIKE ? OR title_en LIKE ? OR body_ta LIKE ?)"); const q = `%${f.q}%`; a.push(q, q, q); }
  return { sql: w.length ? "WHERE " + w.join(" AND ") : "", args: a };
}

const parse = (r: any): News => ({ ...r, facts: JSON.parse(r.facts || "[]"), images: JSON.parse(r.images || "[]") });

export async function list(db: D1Database, f: Filter): Promise<{ items: News[]; total: number }> {
  const { sql, args } = whereOf(f);
  const rows = await db.prepare(`SELECT * FROM news ${sql} ORDER BY day DESC, time DESC LIMIT ? OFFSET ?`)
    .bind(...args, PAGE, (f.page ?? 0) * PAGE).all();
  const total = await db.prepare(`SELECT COUNT(*) AS n FROM news ${sql}`).bind(...args).first<number>("n");
  return { items: (rows.results ?? []).map(parse), total: total ?? 0 };
}

/** today's / tomorrow's power cuts (pinned above the news) */
export async function powerAlerts(db: D1Database, f: Filter): Promise<News[]> {
  const { sql, args } = whereOf({ taluk: f.taluk, place: f.place });
  const rows = await db.prepare(`SELECT * FROM news ${sql ? sql + " AND" : "WHERE"} type = 'power' AND day >= ? ORDER BY day DESC, time DESC LIMIT 5`)
    .bind(...args, istDay(-1)).all();
  return (rows.results ?? []).map(parse);
}

export async function get(db: D1Database, id: string): Promise<News | null> {
  const r = await db.prepare("SELECT * FROM news WHERE id = ?").bind(id).first();
  return r ? parse(r) : null;
}

export async function counts(db: D1Database): Promise<Record<string, number>> {
  const rows = await db.prepare("SELECT taluk, COUNT(*) AS n FROM news GROUP BY taluk").all<{ taluk: string; n: number }>();
  return Object.fromEntries((rows.results ?? []).map((r) => [r.taluk, r.n]));
}

/** a story as the pipeline sends it -> a clean row (area, type, facts and power hours worked out here) */
export interface Incoming {
  story_id: string; headline_ta: string; headline_en?: string; reel_script?: string; story_en?: string; caption?: string;
  location?: string; category?: string; images?: string[]; reel_link?: string; source?: string; published?: string; filed_at?: string;
}
export function toRow(s: Incoming): News {
  const title_ta = clean(s.headline_ta), body_ta = dropOutro(s.reel_script ?? "");
  const { taluk, place } = locate(s.location ?? "", title_ta);
  const type = typeFromCategory(s.category ?? "", title_ta);
  const when = new Date(s.filed_at || s.published || Date.now());
  const ist = new Date((isNaN(+when) ? Date.now() : +when) + 5.5 * 3600e3).toISOString();
  const hours = type === "power" ? powerHours(`${title_ta} ${body_ta} ${s.caption ?? ""}`) : null;
  const reel = String(s.reel_link ?? "").match(/https:\/\/www\.instagram\.com\/reel\/[\w-]+\/?/)?.[0] ?? "";
  return {
    id: clean(s.story_id), day: ist.slice(0, 10), time: ist.slice(11, 16), taluk, place, type,
    title_ta, title_en: clean(s.headline_en), body_ta, body_en: dropOutro(s.story_en ?? ""),
    facts: factsFromCaption(s.caption ?? ""), images: (s.images ?? []).filter((u) => /^https:\/\//.test(u)).slice(0, 6),
    reel_url: reel, source_url: /^https?:\/\//.test(s.source ?? "") ? s.source! : "",
    power_from: hours?.[0] ?? null, power_to: hours?.[1] ?? null,
  };
}

export async function upsert(db: D1Database, n: News): Promise<void> {
  await db.prepare(`INSERT INTO news (id, day, time, taluk, place, type, title_ta, title_en, body_ta, body_en, facts, images, reel_url, source_url, power_from, power_to, updated_at)
    VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,datetime('now'))
    ON CONFLICT(id) DO UPDATE SET day=excluded.day, time=excluded.time, taluk=excluded.taluk, place=excluded.place, type=excluded.type,
      title_ta=excluded.title_ta, title_en=excluded.title_en, body_ta=excluded.body_ta, body_en=excluded.body_en, facts=excluded.facts,
      images=excluded.images, reel_url=excluded.reel_url, source_url=excluded.source_url, power_from=excluded.power_from,
      power_to=excluded.power_to, updated_at=datetime('now')`)
    .bind(n.id, n.day, n.time, n.taluk, n.place, n.type, n.title_ta, n.title_en, n.body_ta, n.body_en,
      JSON.stringify(n.facts), JSON.stringify(n.images), n.reel_url, n.source_url, n.power_from, n.power_to).run();
}
