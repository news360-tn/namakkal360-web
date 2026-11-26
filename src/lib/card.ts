/** News card + power-cut alert markup (Tailwind classes only). Shared by the server page and the browser (infinite scroll). */
import type { News } from "./news";
import { esc } from "./text";
import { typeOf } from "./types";
import { placeOf, talukOf, districtOf } from "./geo";
import { tr, type Lang } from "./i18n";
import { istDay, sourceName } from "./news";

export const ICON: Record<string, string> = {
  power: '<path d="M13 2 4 14h7l-1 8 9-12h-7z"/>', collector: '<path d="M3 21h18M5 21V10l7-5 7 5v11M9 21v-6h6v6"/>',
  accident: '<path d="M5 17h14l-1.5-6h-11zM7 17v2M17 17v2M8 11l1.5-4h5L16 11"/>', crime: '<path d="M12 3 4 6v6c0 5 3.4 8 8 9 4.6-1 8-4 8-9V6z"/>',
  rain: '<path d="M7 15a4 4 0 0 1 .5-8 5.5 5.5 0 0 1 10.5 1.5A3.5 3.5 0 0 1 17 15M9 18l-1 2M13 18l-1 2M17 18l-1 2"/>',
  civic: '<path d="M17 20v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2M10 10a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"/>', edu: '<path d="m2 9 10-5 10 5-10 5zM6 11v5c3 2 9 2 12 0v-5"/>',
  event: '<path d="M12 2l3 6 6 .9-4.5 4.4 1 6.2L12 16.6 6.5 19.5l1-6.2L3 8.9 9 8z"/>', business: '<path d="M3 3v18h18M7 14l4-4 3 3 5-6"/>',
};
export const icon = (k: string, cls = "size-9") =>
  `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICON[k] ?? ICON.civic}</svg>`;

export const placeName = (n: News, lang: Lang) => { const p = placeOf(n.taluk, n.place) ?? talukOf(n.taluk); return p ? p[lang] : ""; };
/** short district name ("கோவை" / "Coimbatore") */
export const districtName = (n: News, lang: Lang) => { const d = districtOf(n.district || "namakkal"); return d ? (lang === "ta" ? d.short_ta : d.short_en) : ""; };
/** "Pollachi · Coimbatore" on the all-district pages, just "Pollachi" on a district page */
const where = (n: News, lang: Lang, withDistrict: boolean) => { const p = placeName(n, lang), dn = districtName(n, lang); return withDistrict && dn && dn !== p ? `${p} · ${dn}` : p; };
export const title = (n: News, lang: Lang) => (lang === "en" && n.title_en) || n.title_ta;
export function when(n: News, lang: Lang, now = Date.now()) {
  const d = n.day === istDay(0, now) ? tr(lang, "today") : n.day === istDay(-1, now) ? tr(lang, "yesterday") :
    new Date(n.day + "T00:00:00").toLocaleDateString(lang === "ta" ? "ta-IN" : "en-IN", { day: "numeric", month: "short" });
  return n.time ? `${d} · ${clock(n.time, lang)}` : d;
}

/** "18:05" -> "மாலை 6:05" / "6:05 PM" (readers asked for AM/PM, not 24-hour time) */
export function clock(hhmm: string, lang: Lang): string {
  const m = /^(\d{1,2}):(\d{2})/.exec(hhmm || "");
  if (!m) return hhmm || "";
  const h = +m[1], mm = m[2], h12 = h % 12 || 12;
  if (lang === "en") return `${h12}:${mm} ${h < 12 ? "AM" : "PM"}`;
  const part = h < 5 ? "இரவு" : h < 12 ? "காலை" : h < 16 ? "மதியம்" : h < 19 ? "மாலை" : "இரவு";
  return `${part} ${h12}:${mm}`;
}
export const href = (n: News, lang: Lang) => `/news/${encodeURIComponent(n.id)}${lang === "en" ? "?lang=en" : ""}`;

/** owner 26 Nov: the same news on Instagram (the reel), Facebook and YouTube - small round icon links in the platform colours */
export const PLATFORM = {
  ig: { name: "Instagram", cls: "text-ig", svg: '<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".6" fill="currentColor"/>' },
  fb: { name: "Facebook", cls: "text-fb", svg: '<path d="M14 8h3V4h-3a4 4 0 0 0-4 4v3H7v4h3v6h4v-6h3l1-4h-4V8z"/>' },
  yt: { name: "YouTube", cls: "text-yt", svg: '<rect x="2.5" y="5.5" width="19" height="13" rx="4"/><path d="m10 9.5 5 2.5-5 2.5z" fill="currentColor"/>' },
} as const;
export type Platform = keyof typeof PLATFORM;
export const platformSvg = (k: Platform, cls = "size-[18px]") =>
  `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${PLATFORM[k].svg}</svg>`;
/** [platform, link] for the links this story has (only Instagram reels, Facebook and YouTube Shorts links are ever stored) */
export const links = (n: News): [Platform, string][] =>
  ([["ig", n.reel_url], ["fb", n.fb_url ?? ""], ["yt", n.yt_url ?? ""]] as [Platform, string][]).filter(([, u]) => /^https:\/\//.test(u));

/** "📰 Source: Dinamalar" - the paper's name, linked to the original report */
export function sourceHtml(n: News, lang: Lang, cls = ""): string {
  const name = sourceName(n.source_url, lang);
  if (!name) return "";
  return `<a href="${esc(n.source_url)}" target="_blank" rel="noopener nofollow" class="relative z-10 inline-flex max-w-full items-center gap-1 truncate text-[12.5px] font-semibold text-mute hover:text-accent ${cls}"><span aria-hidden="true">📰</span><span class="truncate">${esc(tr(lang, "source"))}: <span class="text-ink underline decoration-line underline-offset-2">${esc(name)}</span></span></a>`;
}

/** the news photo as a pencil sketch (the #sketch filter in Base.astro) on a paper-white tile */
export const sketchImg = (src: string, alt: string, cls: string, lazy = true) =>
  `<img src="${esc(src)}" alt="${esc(alt)}" ${lazy ? 'loading="lazy" decoding="async"' : ""} class="${cls} bg-white object-cover [filter:url(#sketch)]">`;

/** one news card. The headline is the card's link (it covers the card); source and platform links sit above it. */
export function cardHtml(n: News, lang: Lang, withDistrict = false): string {
  const t = typeOf(n.type), img = n.images[0];
  const pic = img
    ? sketchImg(img, "", "size-full transition duration-500 group-hover:scale-[1.03]")
    : `<span class="grid size-full place-items-center ${t.text} ${t.soft}">${icon(n.type)}</span>`;
  const plat = links(n).map(([k, u]) =>
    `<a href="${esc(u)}" target="_blank" rel="noopener" aria-label="${PLATFORM[k].name}" title="${PLATFORM[k].name}" class="relative z-10 grid size-9 place-items-center rounded-full border border-line bg-surface ${PLATFORM[k].cls} transition hover:border-current active:scale-95">${platformSvg(k)}</a>`).join("");
  return `<article class="group relative flex animate-rise flex-col overflow-hidden rounded-xl border border-line bg-surface transition hover:-translate-y-0.5 hover:shadow-[0_12px_32px_-16px_rgba(14,22,33,.35)] max-sm:flex-row">
    <div class="aspect-video w-full overflow-hidden border-b border-line bg-white max-sm:aspect-auto max-sm:w-[110px] max-sm:shrink-0 max-sm:border-r max-sm:border-b-0">${pic}</div>
    <div class="flex min-w-0 flex-1 flex-col gap-1.5 p-4 max-sm:p-3">
      <p class="flex min-w-0 items-center gap-1.5 text-[12.5px] font-semibold whitespace-nowrap text-mute"><span class="size-2 shrink-0 rounded-full ${t.bg}"></span><b class="${t.text}">${esc(t[lang])}</b><span class="truncate">· ${esc(where(n, lang, withDistrict))}</span></p>
      <h3 class="font-head text-[16.5px] leading-snug font-semibold text-ink max-sm:text-[15px]"><a href="${href(n, lang)}" class="after:absolute after:inset-0 hover:text-accent">${esc(title(n, lang))}</a></h3>
      ${sourceHtml(n, lang)}
      <div class="mt-auto flex items-center justify-between gap-2 pt-1.5">
        <span class="text-[12.5px] font-medium text-mute">${esc(when(n, lang))}</span>
        ${plat ? `<span class="flex gap-1.5">${plat}</span>` : ""}
      </div>
    </div></article>`;
}

/** cut hours on a 6 AM - 10 PM line */
export function alertHtml(n: News, lang: Lang, withDistrict = false): string {
  const pos = (h: number) => Math.max(0, Math.min(100, ((h - 6) / 16) * 100)).toFixed(1);
  const bar = n.power_from != null && n.power_to != null
    ? `<span class="relative mt-2 block h-1.5 rounded-full bg-line"><span class="absolute inset-y-0 rounded-full bg-t-power" style="left:${pos(n.power_from)}%;right:${(100 - +pos(n.power_to)).toFixed(1)}%"></span></span>` : "";
  return `<a href="${href(n, lang)}" class="mb-3 flex items-center gap-3.5 rounded-xl border border-line border-l-4 border-l-t-power bg-surface p-4 transition hover:shadow-[0_12px_32px_-16px_rgba(14,22,33,.35)] active:scale-[.99]">
    <span class="grid size-11 shrink-0 place-items-center rounded-lg bg-wait-bg text-t-power">${icon("power", "size-6")}</span>
    <span class="min-w-0 flex-1"><span class="block truncate text-[12.5px] font-semibold text-mute"><b class="text-t-power">${esc(tr(lang, "power"))}</b> · ${esc(where(n, lang, withDistrict))} · ${esc(when(n, lang))}</span>
      <span class="block font-head text-base leading-snug font-semibold">${esc(title(n, lang))}</span>${bar}</span></a>`;
}
