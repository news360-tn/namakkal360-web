# namakkal360-web - project context

Website for **Namakkal district news**, every taluk and town, in Tamil and English: **https://www.namakkal360.workers.dev**
(later the owner's `.in` domain). News arrives automatically from the pipeline repo **news360-tn/news360-autopost**.

## How it works

```
news360-autopost posts a reel on Instagram
   -> poster/website.py sends the story (Tamil + English, place, type, details, images, reel + source links, time)
   -> POST /api/ingest (secret INGEST_KEY) -> stored in Cloudflare D1 (filed under taluk / town / type / day automatically)
   -> the site shows it at once (no rebuild, no manual work)
```

| Part | Technology (all Cloudflare free plan) |
|---|---|
| Pages + API | Astro 7 (server pages) on Cloudflare Workers, worker name `www` |
| News store | Cloudflare D1 `namakkal360` (`db/schema.sql`) |
| Styling | **Tailwind CSS only** - `src/styles/global.css` holds the theme (brand colours, news-type colours, smoke animation); no hand-written CSS rules |

## Rules the owner decided (keep them)

| Area | Rule |
|---|---|
| Scope | Namakkal district only; filters: taluk -> town, news type, date; all old news kept, newest first, **15 per page** |
| Look | Brand green/blue header and footer, faint Namakkal Fort background, soft smoke, glass cards; light/dark; Tamil first with one-tap English |
| Pictures | Story cards show the story's own images; place photos (Commons / district administration) only in the area banner, with credit |
| Text | Only a plain "-" (no long dashes), no `<b>` marks, the reel's follow line is removed, times as காலை / மதியம் / மாலை / இரவு or AM / PM |
| Phones | Full-width story pages, lead line + short paragraphs, area/town/type/date as dropdowns |
| Costs | Free plan only - never upgrade or add a card on Cloudflare |
| Privacy | Personal project: commits only as **news360-tn**; no office account, office email or Claude lines in commits; files only in the owner's personal folder |

## Main files

| Path | What |
|---|---|
| `src/pages/index.astro` | home: banner, filters, power-cut alerts, news grid, pagination |
| `src/pages/news/[id].astro` | story page (SEO NewsArticle data) |
| `src/pages/api/news/*`, `src/pages/api/ingest.ts` | public news API and the pipeline's protected door |
| `src/pages/sitemap.xml.ts`, `news-sitemap.xml.ts`, `robots.txt.ts` | SEO |
| `src/lib/news.ts` | D1 queries, filters, incoming story -> row |
| `src/lib/geo.ts`, `types.ts`, `text.ts`, `power.ts`, `card.ts`, `i18n.ts` | places, news types, text clean-up, power-cut hours, cards, words |
| `design/` | approved design preview and design-system page |
| `tests/lib.test.ts` | tests (Vitest), run by `.github/workflows/test.yml` on every push |

## Secrets and settings (values never in the repo)

`.env` (local, git-ignored): CLOUDFLARE_API_TOKEN, CLOUDFLARE_ACCOUNT_ID, INGEST_KEY. On Cloudflare: secret `INGEST_KEY` on worker `www`.
The same key is the GitHub secret `WEBSITE_INGEST_KEY` in news360-autopost.

## Run, test, deploy

```
npm install && npm test && npm run build
npx wrangler d1 execute namakkal360 --local --file=db/schema.sql      # local database
npm run dev                                                             # http://127.0.0.1:4321
set -a && . ./.env && set +a && npx wrangler deploy                     # put the site online (owner runs it)
```

## Recent changes
<!-- recent-changes:start (updated automatically by .github/workflows/context.yml - do not edit by hand) -->
| Date | Commit | Change |
|---|---|---|
| 2026-10-27 | `68778b2` | PROJECT_CONTEXT.md: how the website works, owner rules, files, settings; recent changes updated automatically after every code commit |
| 2026-10-27 | `dd06e2f` | Area: the district name 'Namakkal' no longer hides the real town (Pothanur -> P. Velur) |
| 2026-10-27 | `0455a7b` | Full details: every detail line from the caption (label: value rows and bullet lines) |
| 2026-10-27 | `b087538` | Dropdowns: brand chevron with proper spacing instead of the squeezed browser arrow |
| 2026-10-27 | `e9320a3` | Desktop filters: only taluks as buttons (one line), type and date as dropdowns |
| 2026-10-27 | `200cdf4` | Filters: every taluk and type always visible - wrapped buttons on desktop, compact area/town/type/date dropdowns on phones |
| 2026-10-27 | `e27c978` | Published time with AM/PM: காலை / மதியம் / மாலை / இரவு in Tamil, AM / PM in English |
| 2026-10-27 | `eb3ac90` | Numbered pagination: 15 news per page, own address per page, power cuts pinned on page 1 |
| 2026-10-27 | `fde5870` | Story page: full width on phones, bold lead line + short paragraphs, reel follow line removed |
| 2026-10-27 | `7da0a04` | Mobile: news type and place stay on one line |
| 2026-10-27 | `dcf4681` | SEO: canonical + Tamil/English hreflang, social cards, robots rules, NewsArticle/Breadcrumb/Organization data, sitemap, Google News sitemap, robots.txt, web app manifest |
| 2026-10-27 | `ef02855` | Site address: www.namakkal360.workers.dev |
| 2026-10-27 | `5f40530` | Online D1 database id |
| 2026-10-27 | `14db226` | Namakkal 360 website: Astro + Tailwind CSS on Cloudflare Workers with D1 news store, area/type/date filters, story pages, news API and pipeline ingest; design system |
| 2026-10-27 | `6d1b3dd` | Initial commit |
<!-- recent-changes:end -->
