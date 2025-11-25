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


// CREATE
async function addUser({ username, firstName, lastName, email, age, bio }) {
  const query = `
    INSERT INTO users (username, firstname, lastname, email, age, bio)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *;
  `;

  const params = [username, firstName, lastName, email, age, bio];

  const { rows } = await pool.query(query, params);
  return rows[0]; // return the inserted user (just like your old class stored it)
}

// READ ALL
async function getUsers() {
  const { rows } = await pool.query("SELECT * FROM users ORDER BY id ASC");
  return rows;
}

// READ ONE
async function getUser(id) {
  const { rows } = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
  return rows[0];
}

// UPDATE
async function updateUser(
  id,
  { username, firstName, lastName, email, age, bio }
) {
  const query = `
    UPDATE users
    SET username = $1,
        firstname = $2,
        lastname = $3,
        email = $4,
        age = $5,
        bio = $6
    WHERE id = $7
    RETURNING *;
  `;

  const params = [username, firstName, lastName, email, age, bio, id];

  const { rows } = await pool.query(query, params);
  return rows[0];
}

// DELETE
async function deleteUser(id) {
  await pool.query("DELETE FROM users WHERE id = $1", [id]);
}

module.exports = {
  addUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
};
