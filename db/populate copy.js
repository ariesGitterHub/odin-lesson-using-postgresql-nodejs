require("dotenv").config();

// NOTE having to escape characters, e.g., the ' in "Where's" below

const { Client } = require("pg");

const SQL = `
CREATE TABLE IF NOT EXISTS user_list_table (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  username VARCHAR(255),
  firstname VARCHAR(255),
  lastname VARCHAR(255),
  email VARCHAR(255),
  age INTEGER,
  bio TEXT
);

INSERT INTO user_list_table (username, firstname, lastname, email, age, bio)
VALUES
  ('Alfa001', 'Alphonse', 'Smythe', 'al@example.com', 30, 'Pizza all day!'),
  ('Bast123', 'Brad', 'Johnson', 'bebrad@example.com', 25, 'Cats are my jam...'),
  ('Cato999', 'Catherine', 'Lee', 'catie@example.com', 21, 'Where''s da flava!?!?');
`;

async function main() {
  console.log("seeding...");
  // THE CONNECTION STRING BELOW FAILED...because passwords with special characters must be URL-encoded, but the object config far below avoids the URL entirely — so it succeeds.
  // FAIL
  //   const client = new Client({
  //     connectionString: `postgresql://${process.env.PG_USER}:${process.env.PG_PASSWORD}@${process.env.PG_HOST}:${process.env.PG_PORT}/${process.env.PG_DATABASE}`,
  //   });

    // SUCCESS
  const client = new Client({
    user: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
    host: process.env.PG_HOST,
    port: Number(process.env.PG_PORT),
    database: process.env.PG_DATABASE,
  });

  await client.connect();
  await client.query(SQL);
  await client.end();
  console.log("done");
}

main();
