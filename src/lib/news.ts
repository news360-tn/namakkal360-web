/** Reading and writing stories in the D1 news store. */
import { clean, dropOutro, factsFromCaption } from "./text";
import { typeFromCategory, TYPES } from "./types";
import { locate, districtOf, districtOfTaluk, rowId } from "./geo";
import { powerHours } from "./power";

export interface News {
  id: string; district: string; day: string; time: string; taluk: string; place: string; type: string;
  title_ta: string; title_en: string; body_ta: string; body_en: string;
  facts: { label: string; value: string }[]; images: string[]; reel_url: string; source_url: string;
  /** owner 26 Nov: the same news on Facebook and YouTube (added later by the link sync, never by ingest) */
  fb_url?: string; yt_url?: string;
  /** owner 26 Nov: the kind of news from the source comment ("crime", "death+not_guilty" ...) - the site shows the same safe line */
  safe_kind?: string;
  power_from: number | null; power_to: number | null;
}
export interface Filter { district?: string; taluk?: string; place?: string; type?: string; date?: string; q?: string; page?: number }
export const PAGE = 15;      // news per page

/** today in India (IST), YYYY-MM-DD */
export const istDay = (offsetDays = 0, now = Date.now()) => new Date(now + 5.5 * 3600e3 + offsetDays * 864e5).toISOString().slice(0, 10);

/** only known values reach the database query */
export function sanitize(f: Record<string, string | null | undefined>): Filter {
  // a taluk alone (old links: /?taluk=rasipuram) tells the district; a taluk of another district is ignored
  const d = districtOf(f.district ?? undefined) ?? (f.district ? undefined : districtOfTaluk(f.taluk ?? ""));
  const tk = d?.taluks.find((t) => t.id === f.taluk);
  return {
    district: d?.id,
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
  if (f.district) { w.push("district = ?"); a.push(f.district); }
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

const parse = (r: any): News => ({ ...r, facts: JSON.parse(r.facts || "[]"), images: JSON.parse(r.images || "[]"), fb_url: r.fb_url ?? "", yt_url: r.yt_url ?? "", safe_kind: r.safe_kind ?? "" });

export async function list(db: D1Database, f: Filter): Promise<{ items: News[]; total: number }> {
  const { sql, args } = whereOf(f);
  const rows = await db.prepare(`SELECT * FROM news ${sql} ORDER BY day DESC, time DESC LIMIT ? OFFSET ?`)
    .bind(...args, PAGE, (f.page ?? 0) * PAGE).all();
  const total = await db.prepare(`SELECT COUNT(*) AS n FROM news ${sql}`).bind(...args).first<number>("n");
  return { items: (rows.results ?? []).map(parse), total: total ?? 0 };
}

/** today's / tomorrow's power cuts (pinned above the news) */
export async function powerAlerts(db: D1Database, f: Filter): Promise<News[]> {
  const { sql, args } = whereOf({ district: f.district, taluk: f.taluk, place: f.place });
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

/** per district: all stories, today's stories and the newest headline (for the district cards on the home page) */
export interface DistrictStat { total: number; today: number; latest?: News }
export async function districtStats(db: D1Database, now = Date.now()): Promise<Record<string, DistrictStat>> {
  const rows = await db.prepare("SELECT district, COUNT(*) AS n, SUM(day = ?) AS t FROM news GROUP BY district")
    .bind(istDay(0, now)).all<{ district: string; n: number; t: number }>();
  const out: Record<string, DistrictStat> = {};
  for (const r of rows.results ?? []) out[r.district] = { total: r.n, today: r.t ?? 0 };
  const latest = await db.prepare(`SELECT * FROM news n WHERE id = (SELECT id FROM news m WHERE m.district = n.district ORDER BY day DESC, time DESC LIMIT 1)`).all();
  for (const r of latest.results ?? []) { const x = parse(r); (out[x.district] ??= { total: 0, today: 0 }).latest = x; }
  return out;
}

/** a story as the pipeline sends it -> a clean row (area, type, facts and power hours worked out here) */
export interface Incoming {
  story_id: string; headline_ta: string; headline_en?: string; reel_script?: string; story_en?: string; caption?: string;
  district?: string; location?: string; category?: string; images?: string[]; reel_link?: string; source?: string; published?: string; filed_at?: string;
  safe_kind?: string;
}
export function toRow(s: Incoming): News {
  const title_ta = clean(s.headline_ta), body_ta = dropOutro(s.reel_script ?? "");
  const district = districtOf(s.district)?.id ?? "namakkal";      // stories without a district are Namakkal's (the first site)
  const { taluk, place } = locate(district, s.location ?? "", title_ta);
  const type = typeFromCategory(s.category ?? "", title_ta);
  const when = new Date(s.filed_at || s.published || Date.now());
  const ist = new Date((isNaN(+when) ? Date.now() : +when) + 5.5 * 3600e3).toISOString();
  const hours = type === "power" ? powerHours(`${title_ta} ${body_ta} ${s.caption ?? ""}`) : null;
  const reel = String(s.reel_link ?? "").match(/https:\/\/www\.instagram\.com\/reel\/[\w-]+\/?/)?.[0] ?? "";
  return {
    id: rowId(district, clean(s.story_id)), district, day: ist.slice(0, 10), time: ist.slice(11, 16), taluk, place, type,
    title_ta, title_en: clean(s.headline_en), body_ta, body_en: dropOutro(s.story_en ?? ""),
    facts: factsFromCaption(s.caption ?? ""), images: (s.images ?? []).filter((u) => /^https:\/\//.test(u)).slice(0, 6),
    reel_url: reel, source_url: /^https?:\/\//.test(s.source ?? "") ? s.source! : "",
    power_from: hours?.[0] ?? null, power_to: hours?.[1] ?? null,
    safe_kind: /^[a-z_]{2,20}(\+not_guilty)?$/.test(s.safe_kind ?? "") ? s.safe_kind! : "",
  };
}

export async function upsert(db: D1Database, n: News): Promise<void> {
  await db.prepare(`INSERT INTO news (id, district, day, time, taluk, place, type, title_ta, title_en, body_ta, body_en, facts, images, reel_url, source_url, power_from, power_to, safe_kind, updated_at)
    VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,datetime('now'))
    ON CONFLICT(id) DO UPDATE SET district=excluded.district, day=excluded.day, time=excluded.time, taluk=excluded.taluk, place=excluded.place, type=excluded.type,
      title_ta=excluded.title_ta, title_en=excluded.title_en, body_ta=excluded.body_ta, body_en=excluded.body_en, facts=excluded.facts,
      images=excluded.images, reel_url=excluded.reel_url, source_url=excluded.source_url, power_from=excluded.power_from,
      power_to=excluded.power_to, safe_kind=CASE WHEN excluded.safe_kind <> '' THEN excluded.safe_kind ELSE news.safe_kind END, updated_at=datetime('now')`)
    .bind(n.id, n.district, n.day, n.time, n.taluk, n.place, n.type, n.title_ta, n.title_en, n.body_ta, n.body_en,
      JSON.stringify(n.facts), JSON.stringify(n.images), n.reel_url, n.source_url, n.power_from, n.power_to, n.safe_kind ?? "").run();
}

/** owner 26 Nov: a story's Facebook / YouTube link. Only links of these two shapes are kept. */
export const FB_LINK = /^https:\/\/(www\.|m\.)?facebook\.com\/[\w./?=&%-]{3,300}$/;
export const YT_LINK = /^https:\/\/(www\.)?youtube\.com\/shorts\/[\w-]{6,20}$/;
export interface LinkUpdate { id: string; fb_url?: string; yt_url?: string }
/** only the two link columns change - a story sent again by the pipeline never removes them */
export async function setLinks(db: D1Database, items: LinkUpdate[]): Promise<{ saved: string[]; skipped: { id: string; why: string }[] }> {
  const saved: string[] = [], skipped: { id: string; why: string }[] = [];
  for (const it of items) {
    const id = String(it?.id ?? "");
    if (!/^([A-Z]{2,4}-)?[A-Z]{1,4}-\d{1,7}$/.test(id)) { skipped.push({ id: id.slice(0, 30), why: "bad id" }); continue; }
    const fb = it.fb_url && FB_LINK.test(it.fb_url) ? it.fb_url : "", yt = it.yt_url && YT_LINK.test(it.yt_url) ? it.yt_url : "";
    if (!fb && !yt) { skipped.push({ id, why: "no valid link" }); continue; }
    const r = await db.prepare("UPDATE news SET fb_url = CASE WHEN ? <> '' THEN ? ELSE fb_url END, yt_url = CASE WHEN ? <> '' THEN ? ELSE yt_url END WHERE id = ?")
      .bind(fb, fb, yt, yt, id).run();
    if ((r.meta?.changes ?? 0) > 0) saved.push(id); else skipped.push({ id, why: "story not on the site yet" });
  }
  return { saved, skipped };
}

/** owner 26 Nov: the source shown clearly - newspaper name in Tamil / English from the article's address */
const SOURCES: [RegExp, string, string][] = [
  [/dinamalar\.com/, "தினமலர்", "Dinamalar"], [/dailythanthi\.com/, "தினத்தந்தி", "Daily Thanthi"], [/maalaimalar\.com/, "மாலைமலர்", "Maalaimalar"],
  [/dinakaran\.com/, "தினகரன்", "Dinakaran"], [/dinamani\.com/, "தினமணி", "Dinamani"], [/hindutamil\.in/, "இந்து தமிழ்", "Hindu Tamil"],
  [/thehindu\.com/, "தி இந்து", "The Hindu"], [/vikatan\.com/, "விகடன்", "Vikatan"], [/polimernews\.com/, "பாலிமர் நியூஸ்", "Polimer News"],
  [/news18\.com/, "நியூஸ்18 தமிழ்", "News18 Tamil"], [/abplive\.com/, "ஏபிபி நாடு", "ABP Nadu"], [/puthiyathalaimurai\.com/, "புதிய தலைமுறை", "Puthiya Thalaimurai"],
  [/thanthitv\.com/, "தந்தி டிவி", "Thanthi TV"], [/indianexpress\.com/, "இந்தியன் எக்ஸ்பிரஸ் தமிழ்", "Indian Express Tamil"],
  [/samayam\.com|indiatimes\.com/, "சமயம் தமிழ்", "Samayam Tamil"], [/oneindia\.com/, "ஒன்இந்தியா தமிழ்", "Oneindia Tamil"],
  [/kalaimalar\.com/, "கலைமலர்", "Kalaimalar"], [/covaimail\.com/, "கோவை மெயில்", "Covai Mail"], [/dtnext\.in/, "டிடி நெக்ஸ்ட்", "DT Next"],
  [/tn\.gov\.in|nic\.in/, "அரசு அறிவிப்பு", "Government notice"],
];
export function sourceName(url: string, lang: "ta" | "en"): string {
  if (!url) return "";
  let host = "";
  try { host = new URL(url).hostname.replace(/^www\./, ""); } catch { return ""; }
  const hit = SOURCES.find(([re]) => re.test(host));
  return hit ? (lang === "ta" ? hit[1] : hit[2]) : host;
}
