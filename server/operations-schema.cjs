// Private application tables. Never expose this schema through the Supabase Data API.
const schema=`
CREATE TABLE IF NOT EXISTS ops_sessions(id TEXT PRIMARY KEY,user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,source_session TEXT NOT NULL,created_at BIGINT NOT NULL,expires_at BIGINT NOT NULL);
CREATE INDEX IF NOT EXISTS ops_session_expiry ON ops_sessions(expires_at);
CREATE TABLE IF NOT EXISTS ops_visits(day TEXT NOT NULL,visitor TEXT NOT NULL,visit TEXT NOT NULL,user_id TEXT REFERENCES users(id) ON DELETE SET NULL,first_seen BIGINT NOT NULL,last_seen BIGINT NOT NULL,views INTEGER NOT NULL DEFAULT 0,active_ms BIGINT NOT NULL DEFAULT 0,device TEXT NOT NULL,browser TEXT NOT NULL,scene TEXT NOT NULL,view_name TEXT NOT NULL,subject TEXT NOT NULL,PRIMARY KEY(day,visitor,visit));
CREATE INDEX IF NOT EXISTS ops_visit_seen ON ops_visits(last_seen);
CREATE INDEX IF NOT EXISTS ops_visit_user ON ops_visits(user_id,last_seen);
CREATE TABLE IF NOT EXISTS ops_events(id TEXT PRIMARY KEY,at BIGINT NOT NULL,day TEXT NOT NULL,visitor TEXT NOT NULL,user_id TEXT REFERENCES users(id) ON DELETE SET NULL,kind TEXT NOT NULL,label TEXT NOT NULL,value REAL NOT NULL DEFAULT 0,subject TEXT NOT NULL,scene TEXT NOT NULL);
CREATE INDEX IF NOT EXISTS ops_event_day ON ops_events(day,kind);
CREATE TABLE IF NOT EXISTS ops_requests(minute BIGINT NOT NULL,route TEXT NOT NULL,method TEXT NOT NULL,status INTEGER NOT NULL,n BIGINT NOT NULL,duration_ms REAL NOT NULL,max_ms REAL NOT NULL,PRIMARY KEY(minute,route,method,status));
CREATE INDEX IF NOT EXISTS ops_request_minute ON ops_requests(minute);
CREATE TABLE IF NOT EXISTS ops_learning(user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,subject TEXT NOT NULL,answered INTEGER NOT NULL,attempts BIGINT NOT NULL,correct BIGINT NOT NULL,bookmarks INTEGER NOT NULL,updated_at BIGINT NOT NULL,revision BIGINT NOT NULL DEFAULT 0,PRIMARY KEY(user_id,subject));
CREATE TABLE IF NOT EXISTS ops_audit(id TEXT PRIMARY KEY,at BIGINT NOT NULL,actor TEXT NOT NULL,action TEXT NOT NULL,target TEXT NOT NULL);
CREATE INDEX IF NOT EXISTS ops_audit_at ON ops_audit(at);
`;
module.exports={schema};
