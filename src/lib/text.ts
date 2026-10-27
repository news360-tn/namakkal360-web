/** Text clean-up rules for everything shown on the site (owner: only a plain "-" is ever used, never long dashes). */
export function clean(s: unknown): string {
  return String(s ?? "")
    .replace(/<\/?[a-zA-Z][^>]*>/g, "")      // writer's <b> marks are for the carousel only
    .replace(/\s*[—–]\s*/g, " - ")           // long dashes -> plain hyphen
    .replace(/[ \t]+/g, " ")
    .trim();
}

/** HTML-escape for text placed inside markup. */
export function esc(s: unknown): string {
  return clean(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
}

/** the caption's "📰 முழு விவரம்" section -> details. "🕘 நேரம்: காலை 9" -> label + value; any other detail line -> value only.
 *  Stops at the place/date footer, the follow line and the hashtags. */
export function factsFromCaption(caption: string): { label: string; value: string }[] {
  const out: { label: string; value: string }[] = [];
  const lines = String(caption || "").split("\n");
  const start = lines.findIndex((l) => /முழு\s*விவரம்|full\s*details/i.test(l));
  for (const raw of start >= 0 ? lines.slice(start + 1) : lines) {
    if (/^\s*📍|follow|பின்தொடர|#\w/i.test(raw)) break;
    const line = clean(raw).replace(/^[^\p{L}\p{N}]+/u, "");
    if (line.length < 3 || /http/.test(line)) continue;
    const m = line.match(/^([^:：]{2,24})[:：]\s*(.{2,300})$/u);
    out.push(m ? { label: m[1].trim(), value: m[2].trim() } : { label: "", value: line });
  }
  return out.slice(0, 12);
}

/** story text -> lead sentence + short paragraphs (2 sentences each) for easy reading on phones */
export function paragraphs(body: string, per = 2): { lead: string; rest: string[] } {
  const parts = clean(body).split(/(?<=[.!?।])\s+(?=\S)/u).map((s) => s.trim()).filter((s) => s && !isOutro(s));
  const [lead = "", ...more] = parts;
  const rest: string[] = [];
  for (let i = 0; i < more.length; i += per) rest.push(more.slice(i, i + per).join(" "));
  return { lead, rest };
}

/** the reel's spoken follow line ("மேலும் செய்திகளுக்கு நாமக்கல் த்ரீ சிக்ஸ்டி பக்கத்தை பின்தொடருங்கள்") is not part of the news */
export const isOutro = (s: string) => /பின்தொடர|த்ரீ\s*சிக்ஸ்டி|follow\s+(namakkal|rasipuram)|three\s*sixty/i.test(s);
export const dropOutro = (body: string) => clean(body).split(/(?<=[.!?।])\s+(?=\S)/u).filter((x) => !isOutro(x)).join(" ");
