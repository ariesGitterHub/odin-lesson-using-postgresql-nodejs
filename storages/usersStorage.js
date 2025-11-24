// NOTE - THIS IS NO LONGER BEING USED, BUT KEEP FOR REFERENCE; SWITCHED TO POSTGRESQL DB (see db folder!), ALL firstName and lastName are now firstname and lastname to comply with lowercase in the postgreSQL db. 

// This class lets us simulate interacting with a database.
// And we’ll use a storage class to hold the users we create. In real-world scenarios, you would almost certainly be using a database for this, which you’ll explore further in upcoming lessons. This class is just for demonstration purposes before we get there.

class UsersStorage {
  constructor() {
    this.storage = {};
    this.id = 1;
  }

  addUser({ username, firstName, lastName, email, age, bio }) {
    const id = this.id;
    this.storage[id] = { id, username, firstName, lastName, email, age, bio };
    this.id++;
  }

  getUsers() {
    return Object.values(this.storage);
  }

  getUser(id) {
    return this.storage[id];
  }

  updateUser(id, { username, firstName, lastName, email, age, bio }) {
    this.storage[id] = { id, username, firstName, lastName, email, age, bio };
  }

  deleteUser(id) {
    delete this.storage[id];
  }
}
// Rather than exporting the class, we can export an instance of the class by instantiating it.
// This ensures only one instance of this class can exist, also known as the "singleton" pattern.
module.exports = new UsersStorage();
