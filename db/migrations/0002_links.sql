-- 26 Nov 2026: the same news on Facebook and YouTube (set by the link sync through /api/links)
ALTER TABLE news ADD COLUMN fb_url TEXT NOT NULL DEFAULT '';
ALTER TABLE news ADD COLUMN yt_url TEXT NOT NULL DEFAULT '';
-- the kind of news from the page's source comment (crime, death, power_cut ...): the story shows the same safe line as Instagram
ALTER TABLE news ADD COLUMN safe_kind TEXT NOT NULL DEFAULT '';
