CREATE TABLE IF NOT EXISTS kienhoc.security_mail (
 id TEXT PRIMARY KEY, user_id TEXT NOT NULL REFERENCES kienhoc.users(id) ON DELETE CASCADE,
 created_at BIGINT NOT NULL, next_attempt BIGINT NOT NULL, attempts INTEGER NOT NULL DEFAULT 0,
 sent_at BIGINT
);
CREATE INDEX IF NOT EXISTS security_mail_due ON kienhoc.security_mail(sent_at,next_attempt);
CREATE INDEX IF NOT EXISTS otps_expiry ON kienhoc.otps(expires_at);
ALTER TABLE kienhoc.security_mail ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON kienhoc.security_mail FROM PUBLIC;
