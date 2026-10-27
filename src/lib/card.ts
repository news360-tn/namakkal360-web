/** News card + power-cut alert markup (Tailwind classes only). Shared by the server page and the browser (infinite scroll). */
import type { News } from "./news";
import { esc } from "./text";
import { typeOf } from "./types";
import { placeOf, talukOf } from "./geo";
import { tr, type Lang } from "./i18n";
import { istDay } from "./news";

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
export const title = (n: News, lang: Lang) => (lang === "en" && n.title_en) || n.title_ta;
export function when(n: News, lang: Lang, now = Date.now()) {
  const d = n.day === istDay(0, now) ? tr(lang, "today") : n.day === istDay(-1, now) ? tr(lang, "yesterday") :
    new Date(n.day + "T00:00:00").toLocaleDateString(lang === "ta" ? "ta-IN" : "en-IN", { day: "numeric", month: "short" });
  return n.time ? `${d} · ${n.time}` : d;
}
export const href = (n: News, lang: Lang) => `/news/${encodeURIComponent(n.id)}${lang === "en" ? "?lang=en" : ""}`;

export function cardHtml(n: News, lang: Lang): string {
  const t = typeOf(n.type), img = n.images[0];
  const pic = img
    ? `<img src="${esc(img)}" alt="" loading="lazy" decoding="async" class="size-full object-cover transition duration-500 group-hover:scale-105">`
    : `<span class="grid size-full place-items-center ${t.text} ${t.soft}">${icon(n.type)}</span>`;
  return `<a href="${href(n, lang)}" class="group flex animate-rise flex-col overflow-hidden rounded-[18px] border border-t-[3px] border-black/5 ${t.line} bg-white/75 shadow-sm backdrop-blur-md transition hover:-translate-y-0.5 hover:shadow-xl active:scale-[.97] max-sm:flex-row dark:border-white/10 dark:bg-slate-900/65">
    <span class="block aspect-video w-full overflow-hidden max-sm:aspect-auto max-sm:w-28 max-sm:shrink-0">${pic}</span>
    <span class="flex flex-1 flex-col gap-1.5 p-4 max-sm:p-3">
      <span class="flex min-w-0 items-center gap-1.5 text-[12.5px] font-semibold whitespace-nowrap text-slate-500 dark:text-slate-400"><b class="${t.text}">${esc(t[lang])}</b><span class="truncate">· ${esc(placeName(n, lang))}</span></span>
      <span class="text-[16.5px] font-bold leading-snug text-slate-900 max-sm:text-[15.5px] dark:text-slate-100">${esc(title(n, lang))}</span>
      <span class="mt-auto pt-1 text-[12.5px] font-semibold text-slate-500 dark:text-slate-400">${esc(when(n, lang))}</span>
    </span></a>`;
}

/** cut hours on a 6 AM - 10 PM line */
export function alertHtml(n: News, lang: Lang): string {
  const pos = (h: number) => Math.max(0, Math.min(100, ((h - 6) / 16) * 100)).toFixed(1);
  const bar = n.power_from != null && n.power_to != null
    ? `<span class="relative mt-2 block h-2 rounded-full bg-black/10"><span class="absolute inset-y-0 rounded-full bg-linear-to-r from-amber-500 to-red360" style="left:${pos(n.power_from)}%;right:${(100 - +pos(n.power_to)).toFixed(1)}%"></span></span>` : "";
  return `<a href="${href(n, lang)}" class="mb-3.5 flex items-center gap-3.5 rounded-[18px] bg-linear-to-r from-amber-100 to-orange-200 p-4 text-amber-950 shadow-sm transition active:scale-[.98] dark:from-amber-950 dark:to-orange-950 dark:text-amber-100">
    <span class="grid size-11 shrink-0 place-items-center rounded-xl bg-linear-to-br from-amber-500 to-red360 text-white">${icon("power", "size-6")}</span>
    <span class="flex-1"><span class="block text-[12.5px] font-semibold opacity-75">${esc(tr(lang, "power"))} · ${esc(placeName(n, lang))} · ${esc(when(n, lang))}</span>
      <span class="block text-base font-bold leading-snug">${esc(title(n, lang))}</span>${bar}</span></a>`;
}
