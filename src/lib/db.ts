import { sql } from '@vercel/postgres';

// Create tables if they don't exist
// Note: In a real prod app, migration scripts are better. 
// For this scale, checking on init or letting the route frame it is fine.
// We will export a setup function that the API route can call lazily.

export const initDb = async () => {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS declarations (
        id SERIAL PRIMARY KEY,
        content TEXT NOT NULL,
        author TEXT NOT NULL, -- 'Kaine' or 'Kelvin'
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;
    // console.log("Database initialized");
  } catch (error) {
    console.error("Failed to initialize database:", error);
  }
};

export default sql;
