const Database=require('better-sqlite3'),fs=require('node:fs'),path=require('node:path');
function openDatabase(filename){if(filename!==':memory:')fs.mkdirSync(path.dirname(path.resolve(filename)),{recursive:true,mode:0o700});const db=new Database(filename);db.pragma('journal_mode = WAL');db.pragma('foreign_keys = ON');db.pragma('busy_timeout = 5000');
 db.exec(`CREATE TABLE IF NOT EXISTS users(id TEXT PRIMARY KEY,email TEXT UNIQUE NOT NULL,password_hash TEXT,created_at TEXT NOT NULL);
 CREATE TABLE IF NOT EXISTS otps(id INTEGER PRIMARY KEY,email TEXT NOT NULL,code TEXT NOT NULL,expires_at INTEGER NOT NULL,used INTEGER NOT NULL DEFAULT 0,attempts INTEGER NOT NULL DEFAULT 0,created_at INTEGER NOT NULL);
 CREATE INDEX IF NOT EXISTS otps_email ON otps(email,id DESC);
 CREATE TABLE IF NOT EXISTS progress(user_id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,data TEXT NOT NULL,updated_at TEXT NOT NULL,revision INTEGER NOT NULL DEFAULT 1);
 CREATE TABLE IF NOT EXISTS sessions(id TEXT PRIMARY KEY,user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,expires_at INTEGER NOT NULL);
 CREATE TABLE IF NOT EXISTS user_profiles(user_id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,username TEXT NOT NULL DEFAULT '',avatar TEXT,completed INTEGER NOT NULL DEFAULT 1,revision INTEGER NOT NULL DEFAULT 1,updated_at TEXT NOT NULL);
 PRAGMA user_version = 2;`);if(filename!==':memory:')fs.chmodSync(filename,0o600);return db;}
module.exports={openDatabase};
