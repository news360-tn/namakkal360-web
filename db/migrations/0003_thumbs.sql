-- 26 Nov 2026: the website keeps its own small copy of each story's pictures. The pipeline's picture links (R2) are deleted after
-- 24 hours, so a story's picture must not depend on them. thumbs = how many pictures of the story are stored here.
ALTER TABLE news ADD COLUMN thumbs INTEGER NOT NULL DEFAULT 0;
CREATE TABLE IF NOT EXISTS news_thumb (
  id  TEXT    NOT NULL,
  n   INTEGER NOT NULL,
  b64 TEXT    NOT NULL,
  PRIMARY KEY (id, n)
);
