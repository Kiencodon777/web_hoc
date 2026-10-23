CREATE SCHEMA IF NOT EXISTS kienhoc;
REVOKE ALL ON SCHEMA kienhoc FROM PUBLIC;
CREATE TABLE IF NOT EXISTS kienhoc.domain_handoffs (
  token_hash TEXT PRIMARY KEY,
  payload TEXT NOT NULL,
  expires_at BIGINT NOT NULL
);
CREATE INDEX IF NOT EXISTS domain_handoffs_expiry ON kienhoc.domain_handoffs(expires_at);
ALTER TABLE kienhoc.domain_handoffs ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON kienhoc.domain_handoffs FROM PUBLIC;
