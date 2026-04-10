-- =============================================
-- Lao Lottery Hub - D1 Schema (SQLite)
-- =============================================

CREATE TABLE IF NOT EXISTS lottery_results (
  id                INTEGER PRIMARY KEY AUTOINCREMENT,
  draw_date         TEXT NOT NULL UNIQUE,
  num6              TEXT,
  num5              TEXT,
  num4              TEXT,
  num3_top          TEXT,
  num2_top          TEXT,
  num2_bottom       TEXT,
  animal_name_th    TEXT,
  animal_name_lo    TEXT,
  youtube_embed_url TEXT,
  created_at        TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_lottery_results_draw_date
  ON lottery_results(draw_date DESC);

CREATE TABLE IF NOT EXISTS user_numbers (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  session_id  TEXT NOT NULL,
  numbers     TEXT NOT NULL,
  draw_date   TEXT NOT NULL,
  created_at  TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_user_numbers_session
  ON user_numbers(session_id);

CREATE INDEX IF NOT EXISTS idx_user_numbers_draw_date
  ON user_numbers(draw_date);

CREATE TABLE IF NOT EXISTS statistics_cache (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  stat_type   TEXT NOT NULL UNIQUE,
  stat_data   TEXT NOT NULL DEFAULT '{}',
  updated_at  TEXT DEFAULT (datetime('now'))
);

INSERT OR IGNORE INTO lottery_results (
  draw_date, num6, num5, num4, num3_top, num2_top, num2_bottom,
  animal_name_th, animal_name_lo, youtube_embed_url
) VALUES (
  '2026-04-09',
  '081478', '81478', '1478', '478', '78', '14',
  'เม่น', 'ເໝັ້ນ',
  'https://www.youtube.com/embed/KdnYFYpQQ7A'
);
