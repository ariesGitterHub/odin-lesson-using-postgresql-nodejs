require("dotenv").config();

const { Client } = require("pg");

// NOTE - below is better than what is in populate copy.js because...
// Idempotent: ON CONFLICT (username) DO NOTHING ensures running the script multiple times won’t insert duplicates.

// Safe: Uses parameterized queries → handles quotes, apostrophes, and special characters automatically.

// Readable and maintainable: Easy to add new users without rebuilding placeholders manually.

// Scalable for moderate datasets: For hundreds of users this loop is fine. For tens of thousands, you’d still want a bulk insert.

const users = [
  ["Alfa001", "Alphonse", "Smythe", "al@example.com", 30, "Pizza all day!"],
  [
    "Bast123",
    "Brad",
    "Johnson",
    "bebrad@example.com",
    25,
    "Cats are my jam...",
  ],
  [
    "Cato999",
    "Catherine",
    "Lee",
    "catie@example.com",
    21,
    "Where's da flava!?!?",
  ],
];

async function main() {
  console.log("Seeding...");

  const client = new Client({
    user: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
    host: process.env.PG_HOST,
    port: Number(process.env.PG_PORT),
    database: process.env.PG_DATABASE,
  });

  await client.connect();

  // Create table if not exists
  await client.query(`
    CREATE TABLE IF NOT EXISTS user_list_table (
      id SERIAL PRIMARY KEY,
      username VARCHAR(255) UNIQUE,
      firstname VARCHAR(255),
      lastname VARCHAR(255),
      email VARCHAR(255),
      age INTEGER,
      bio TEXT
    );
  `);

  // Insert users one by one (safe and idempotent)
  for (const [username, firstname, lastname, email, age, bio] of users) {
    await client.query(
      `
      INSERT INTO user_list_table (username, firstname, lastname, email, age, bio)
      VALUES ($1, $2, $3, $4, $5, $6)
      ON CONFLICT (username) DO NOTHING;
      `,
      [username, firstname, lastname, email, age, bio]
    );
  }

  await client.end();
  console.log("Seeding complete!");
}

main().catch((err) => console.error("Error seeding DB:", err));
