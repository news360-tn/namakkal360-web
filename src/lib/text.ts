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

/** "📰 முழு விவரம்" lines of the Instagram caption ("🕘 நேரம்: காலை 9 ...") -> label/value facts. */
export function factsFromCaption(caption: string): { label: string; value: string }[] {
  const out: { label: string; value: string }[] = [];
  for (const raw of String(caption || "").split("\n")) {
    const line = clean(raw).replace(/^[^\p{L}\p{N}]+/u, "");        // drop the leading emoji
    const m = line.match(/^([^:：]{2,24})[:：]\s*(.{2,160})$/u);
    if (m && !/http|#/.test(line)) out.push({ label: m[1].trim(), value: m[2].trim() });
  }
  return out.slice(0, 8);
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
