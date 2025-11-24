// ALL CODE THAT TALKS TO THE DATABASE GOES HERE, SO ALL SQL AND SEARCH

const pool = require("./pool");

// async function getAllUsernames() {
//   const { rows } = await pool.query("SELECT * FROM usernames");
//   return rows;
// }

// async function insertUsername(username) {
//   await pool.query("INSERT INTO usernames (username) VALUES ($1)", [username]);
// }

// module.exports = {
//   getAllUsernames,
//   insertUsername,
// };

// --- Get all users ---
async function getUsers() {
  const { rows } = await pool.query(
    "SELECT * FROM user_list_table ORDER BY id"
  );
  return rows;
}

// --- Get single user by id ---
async function getUser(id) {
  const { rows } = await pool.query(
    "SELECT * FROM user_list_table WHERE id = $1",
    [id]
  );
  return rows[0]; // returns single user object or undefined
}

// --- Add a new user ---
async function addUser({ username, firstname, lastname, email, age, bio }) {
  const query = `
    INSERT INTO user_list_table 
      (username, firstname, lastname, email, age, bio)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *;
  `;
  const values = [username, firstname, lastname, email, age, bio];
  const { rows } = await pool.query(query, values);
  return rows[0]; // return the inserted user
}

// --- Update a user by id ---
async function updateUser(
  id,
  { username, firstname, lastname, email, age, bio }
) {
  const query = `
    UPDATE user_list_table
    SET username = $1,
        firstname = $2,
        lastname = $3,
        email = $4,
        age = $5,
        bio = $6
    WHERE id = $7
    RETURNING *;
  `;
  const values = [username, firstname, lastname, email, age, bio, id];
  const { rows } = await pool.query(query, values);
  return rows[0]; // return the updated user
}

// --- Delete a user by id ---
async function deleteUser(id) {
  await pool.query("DELETE FROM user_list_table WHERE id = $1", [id]);
}

// --- Search users by optional fields (see fields below) ---
//  THIS IS NEW CODE, and better than doing search in usersController.js, see that file for old search code

// --- Search users by only the fields provided ---

async function searchUsers({ username, firstname, lastname, email }) {
  let query = `SELECT * FROM user_list_table`;
  const values = [];
  const conditions = [];

  if (username) {
    values.push(`%${username}%`);
    conditions.push(`LOWER(username) LIKE LOWER($${values.length})`);
  }

  if (firstname) {
    values.push(`%${firstname}%`);
    conditions.push(`LOWER(firstname) LIKE LOWER($${values.length})`);
  }

  if (lastname) {
    values.push(`%${lastname}%`);
    conditions.push(`LOWER(lastname) LIKE LOWER($${values.length})`);
  }

  if (email) {
    values.push(`%${email}%`);
    conditions.push(`LOWER(email) LIKE LOWER($${values.length})`);
  }

  if (conditions.length > 0) {
    query += ` WHERE ` + conditions.join(" AND ");
  }

  query += " ORDER BY id";

  const { rows } = await pool.query(query, values);
  return rows;
}


module.exports = {
  getUsers,
  getUser,
  addUser,
  updateUser,
  deleteUser,
  searchUsers,   // ← add this
};

