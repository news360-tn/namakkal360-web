-- 22 Nov 2026: one site for all 7 districts. Every story already stored is Namakkal's.
ALTER TABLE news ADD COLUMN district TEXT NOT NULL DEFAULT 'namakkal';
CREATE INDEX IF NOT EXISTS news_district ON news(district, day DESC, time DESC);
