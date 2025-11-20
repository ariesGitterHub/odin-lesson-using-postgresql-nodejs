// storages/usersStorage.js
// This class lets us simulate interacting with a database.
// And we’ll use a storage class to hold the users we create. In real-world scenarios, you would almost certainly be using a database for this, which you’ll explore further in upcoming lessons. This class is just for demonstration purposes before we get there.

class UsersStorage {
  constructor() {
    this.storage = {};
    this.id = 0 + 1;
  }

  addUser({ firstName, lastName, email, age, bio }) {
    const id = this.id;
    this.storage[id] = { id, firstName, lastName, email, age, bio };
    this.id++;
  }

  getUsers() {
    return Object.values(this.storage);
  }

  getUser(id) {
    return this.storage[id];
  }

  // searchUsers(query) {
  //   const q = query.toLowerCase();
  //   return Object.values(this.storage).filter(
  //     (user) =>
  //       user.firstName.toLowerCase().includes(q) ||
  //       user.lastName.toLowerCase().includes(q) ||
  //       user.email.toLowerCase().includes(q)
  //   );
  // }

  updateUser(id, { firstName, lastName, email, age, bio }) {
    this.storage[id] = { id, firstName, lastName, email, age, bio };
  }

  deleteUser(id) {
    delete this.storage[id];
  }
}
// Rather than exporting the class, we can export an instance of the class by instantiating it.
// This ensures only one instance of this class can exist, also known as the "singleton" pattern.
module.exports = new UsersStorage();
