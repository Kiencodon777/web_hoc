CREATE TABLE IF NOT EXISTS kienhoc.rate_limits (
  key TEXT PRIMARY KEY, hits INTEGER NOT NULL, reset_at BIGINT NOT NULL
);
CREATE INDEX IF NOT EXISTS rate_limits_expiry ON kienhoc.rate_limits(reset_at);
ALTER TABLE kienhoc.rate_limits ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON kienhoc.rate_limits FROM PUBLIC;
