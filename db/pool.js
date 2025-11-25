// POOL MANAGES YOUR CONNECTIONS 

require("dotenv").config(); // Load environment variables

// Below is the "Client — a single, manual connection"; Think of Client as booking a single table at a restaurant every time you eat.

// Pros:
// Simple for one-off scripts or ad-hoc queries.
// You control exactly when the connection opens and closes.
// Cons:
// Every new query requires a new connection (or you have to keep the client alive yourself).
// Opening/closing connections is expensive. If your server handles many requests, this can slow things down and overload PostgreSQL.

// const { Client } = require("pg");

// // All of the following properties should be read from environment variables
// module.exports = new Client({
//   host: process.env.PG_HOST, // or wherever the db is hosted
//   user: process.env.PG_USER,
//   database: process.env.PG_DATABASE,
//   password: process.env.PG_PASSWORD,
//   port: Number(process.env.PG_PORT), // The default port
// });

// ! I guess below could be moved to db/queries.js ...

//With above, you can run queries, then disconnect:
// async function run() {
//   await client.connect(); // Open the connection
//   const res = await client.query("SELECT * FROM users");
//   console.log(res.rows);
//   await client.end(); // Close the connection
// }
// run();



// Below is the "Pool — a managed pool of clients"; Think of Pool as having a set of reserved tables at a restaurant. The pool keeps several connections open in the background. When your app needs to run a query, it borrows a connection from the pool. When the query finishes, the connection goes back into the pool for reuse.

const { Pool } = require("pg");

// All of the following properties should be read from environment variables
module.exports = new Pool({
  host: process.env.PG_HOST, // or wherever the db is hosted
  user: process.env.PG_USER,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: Number(process.env.PG_PORT), // The default port
  max: 10, // Optional: max clients in the pool
});

// ! I guess below could be moved to db/queries.js ...

// async function getUsers() {
//   const res = await pool.query("SELECT * FROM users"); // pool manages connections
//   console.log(res.rows);
// }

// getUsers();

// NOTE! An alternative to defining the connection information is through a Connection URI. SEE BELOW. You’ll likely be using connection URIs when connecting with a hosted database service. Here’s what it would look like based on the above properties:

// const { Pool } = require("pg");

// // Again, this should be read from an environment variable
// module.exports = new Pool({
//  connectionString: 
//    `postgresql://${process.env.PG_USER}:${process.env.PG_PASSWORD}@${process.env.PG_HOST}:${process.env.PG_PORT}/${process.env.PG_DATABASE}`,
// });

// ! I guess below could be moved to db/queries.js ...

// async function getUsers() {
//   const res = await pool.query("SELECT * FROM users"); // pool manages connections
//   console.log(res.rows);
// }

// getUsers();


// Pick whichever method you want to use.