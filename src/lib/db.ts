import { createClient } from '@libsql/client';

export const db = createClient({
  url: import.meta.env.TURSO_DATABASE_URL,
  authToken: import.meta.env.TURSO_AUTH_TOKEN,
});

export async function initDB() {
  await db.batch([
    `CREATE TABLE IF NOT EXISTS quotes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      content TEXT NOT NULL,
      ip_hash TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      approved INTEGER DEFAULT 1
    )`,
    `CREATE TABLE IF NOT EXISTS counter (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      count INTEGER DEFAULT 0
    )`,
    `INSERT OR IGNORE INTO counter (id, count) VALUES (1, 12847)`,
  ]);
}
