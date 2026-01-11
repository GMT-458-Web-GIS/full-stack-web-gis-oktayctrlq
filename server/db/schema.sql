CREATE EXTENSION IF NOT EXISTS postgis;

CREATE TABLE IF NOT EXISTS issues (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  photo TEXT,
  geom GEOMETRY(Point, 4326),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_issues_geom
ON issues
USING GIST (geom);
