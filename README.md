# Namakkal 360 - website

Namakkal district news, every taluk and town, in Tamil and English.

- **Site, API and news store:** Astro on Cloudflare Workers + Cloudflare D1 (free tier)
- **Styling:** Tailwind CSS only (`src/styles/global.css` holds the Tailwind theme: brand colours, news-type colours, smoke animation)
- **News:** sent automatically by the news360-autopost pipeline to `POST /api/ingest` (secret `INGEST_KEY`)

## API
| | |
|---|---|
| `GET /api/news?taluk=&place=&type=&date=&q=&page=&lang=` | list (12 per page) |
| `GET /api/news/{id}` | one story |
| `POST /api/ingest` | pipeline only (Bearer `INGEST_KEY`) |

## Local
```
npm install
npx wrangler d1 execute namakkal360 --local --file=db/schema.sql
echo "INGEST_KEY=<any local secret>" > .dev.vars
npm run dev        # http://127.0.0.1:4321
npm test
```

`design/` holds the approved design preview and the design-system page.
