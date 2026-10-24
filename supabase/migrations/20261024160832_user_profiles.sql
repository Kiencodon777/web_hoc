-- Account-owned, compressed avatar thumbnails; never exposed through the Data API.
CREATE TABLE IF NOT EXISTS kienhoc.user_profiles (
 user_id TEXT PRIMARY KEY REFERENCES kienhoc.users(id) ON DELETE CASCADE,
 username TEXT NOT NULL DEFAULT '' CHECK (char_length(username) <= 32),
 avatar TEXT CHECK (octet_length(avatar) <= 131094),
 completed INTEGER NOT NULL DEFAULT 1 CHECK (completed IN (0,1)),
 revision INTEGER NOT NULL DEFAULT 1 CHECK (revision >= 1),
 updated_at TEXT NOT NULL
);
ALTER TABLE kienhoc.user_profiles ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON kienhoc.user_profiles FROM PUBLIC;
