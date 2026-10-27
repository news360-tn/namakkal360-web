-- Namakkal 360 news store (Cloudflare D1 / SQLite). One row per story; the pipeline sends every new story here.
CREATE TABLE IF NOT EXISTS news (
  id          TEXT PRIMARY KEY,          -- story id from the pipeline (RN-140)
  day         TEXT NOT NULL,             -- IST date the news belongs to, YYYY-MM-DD
  time        TEXT NOT NULL DEFAULT '',  -- IST HH:MM it was filed
  taluk       TEXT NOT NULL,
  place       TEXT NOT NULL DEFAULT '',
  type        TEXT NOT NULL,
  title_ta    TEXT NOT NULL,
  title_en    TEXT NOT NULL DEFAULT '',
  body_ta     TEXT NOT NULL DEFAULT '',
  body_en     TEXT NOT NULL DEFAULT '',
  facts       TEXT NOT NULL DEFAULT '[]',  -- JSON [{label,value}]
  images      TEXT NOT NULL DEFAULT '[]',  -- JSON [url] - the story's own pictures
  reel_url    TEXT NOT NULL DEFAULT '',
  source_url  TEXT NOT NULL DEFAULT '',
  power_from  REAL,                         -- power-cut hours (24 h) when type = power
  power_to    REAL,
  updated_at  TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS news_day   ON news(day DESC, time DESC);
CREATE INDEX IF NOT EXISTS news_taluk ON news(taluk, day DESC);
CREATE INDEX IF NOT EXISTS news_type  ON news(type, day DESC);
