import Database from 'better-sqlite3';
import path from 'path';

// Initialize the database
// Vercel serverless functions have a read-only filesystem (except /tmp)
// better-sqlite3 cannot write to process.cwd() in production there.
// We fallback to an in-memory database for demo purposes on Vercel.
const dbPath = process.env.VERCEL || process.env.NODE_ENV === 'production'
  ? ':memory:'
  : path.join(process.cwd(), 'kake.db');

const db = new Database(dbPath);

// Create tables if they don't exist
const initDb = () => {
  db.exec(`
    CREATE TABLE IF NOT EXISTS declarations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      content TEXT NOT NULL,
      author TEXT NOT NULL, -- 'Kaine' or 'Kelvin'
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
};

initDb();

export default db;
