// THIS FILE IS FOR BUSINESS LOGIC AND RENDERING

// Let’s add a few methods to our usersController.js for validating and sanitizing our form to get the type of data we want. From *HERE*
const { body, validationResult, matchedData } = require("express-validator");
// We retrieve all validated data via the matchedData() function to ensure all the data we get will include any sanitization done (such as trimmed data).

// const usersStorage = require("../storages/usersStorage");

const {
  addUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  searchUsers,
} = require("../db/queries");

// Title variables
const userListTitle = "User list";
const userSearchTitle = "Search users";
const createUserTitle = "Create user";
const updateUserTitle = "Update user";

// Error messages
const userErr =
  "must contain letters, numbers, underscores, periods, and hyphens.";
const alphaErr = "must only contain letters, dashes, and/or apostrophes.";
const userLengthErr = "must be between 5 and 30 characters.";
const lengthErr = "must be between 1 and 20 characters.";
const emailErr = "Please enter a valid email address.";
const emailLengthErr = "must be less than 100 characters.";
const numberErr = "must be a number between 18 and 120.";
const bioLengthErr = "cannot exceed 200 characters.";

// Below, use .matches() only for character checking, keep .isLength() for length checking
const validateUser = [
  body("username")
    .trim()
    .matches(/^[A-Za-z0-9_.-]+$/)
    .withMessage(userErr)
    .isLength({ min: 5, max: 30 })
    .withMessage(`Username ${userLengthErr}`),
  // body("firstName")
  body("firstname")
    .trim()
    .matches(/^[A-Za-z'-]+$/)
    .withMessage(`First name ${alphaErr}`)
    .isLength({ min: 1, max: 20 })
    .withMessage(`First name ${lengthErr}`),
  // body("lastName")
  body("lastname")
    .trim()
    .matches(/^[A-Za-z'-]+$/)
    .withMessage(`Last name ${alphaErr}`)
    .isLength({ min: 1, max: 20 })
    .withMessage(`Last name ${lengthErr}`),
  body("email")
    .trim()
    .isEmail()
    .withMessage(emailErr)
    .isLength({ max: 100 })
    .withMessage(`Email ${emailLengthErr}`),
  body("age")
    .optional({ values: "falsy" })
    .trim()
    .isInt({ min: 18, max: 120 })
    .withMessage(`Age ${numberErr}`),
  body("bio")
    // .optional({ values: "falsy" })
    .optional() // This is more common than line above
    .trim()
    .isLength({ max: 200 })
    .withMessage(`Bio ${bioLengthErr}`),
];

// --- List users ---
// exports.usersListGet = (req, res) => {
//   res.render("index", {
//     title: userListTitle,
//     users: usersStorage.getUsers(),
//   });
// };

exports.usersListGet = async (req, res) => {
  const users = await getUsers();
  res.render("index", {
    title: userListTitle,
    users,
  });
};

// exports.usersSearchGet = (req, res) => {
//   const {
//     username = "",
//     firstName = "",
//     lastName = "",
//     email = "",
//   } = req.query;

//   const u = username.toLowerCase();
//   const f = firstName.toLowerCase();
//   const l = lastName.toLowerCase();
//   const e = email.toLowerCase();

//   const users = usersStorage.getUsers();

//   const filtered = users.filter((user) => {
//     const matchUser = u && user.username.toLowerCase().includes(u);
//     const matchFirst = f && user.firstName.toLowerCase().includes(f);
//     const matchLast = l && user.lastName.toLowerCase().includes(l);
//     const matchEmail = e && user.email.toLowerCase().includes(e);

//     return matchUser || matchFirst || matchLast || matchEmail;
//   });

//   res.render("search", {
//     title: userSearchTitle,
//     users: filtered,
//     q: { username, firstName, lastName, email }, // for repopulating form
//   });
// };

// --- Create user (GET) ---


// NOTE/WARNING - Using JS for search code gets expensive as it scales, it works but is not ideal...
// REPLACE THIS...
// exports.usersSearchGet = async (req, res) => {
//   const {
//     username = "",
//     // firstName = "",
//     // lastName = "",
//     firstname = "",
//     lastname = "",
//     email = "",
//   } = req.query;

//   const u = username.toLowerCase();
//   // const f = firstName.toLowerCase();
//   // const l = lastName.toLowerCase();
//   const f = firstname.toLowerCase();
//   const l = lastname.toLowerCase();
//   const e = email.toLowerCase();

//   const users = await getUsers(); // now users is an array

//   const filtered = users.filter((user) => {
//     const matchUser = u && user.username.toLowerCase().includes(u);
//     const matchFirst = f && user.firstname.toLowerCase().includes(f);
//     const matchLast = l && user.lastname.toLowerCase().includes(l);
//     const matchEmail = e && user.email.toLowerCase().includes(e);
//     return matchUser || matchFirst || matchLast || matchEmail;
//   });

//   res.render("search", {
//     title: userSearchTitle,
//     users: filtered,
//     // q: { username, firstName, lastName, email },
//     q: { username, firstname, lastname, email },
//   });
// };

// with this better code...
// exports.usersSearchGet = async (req, res) => {
//   const {
//     username = "",
//     firstname = "",
//     lastname = "",
//     email = "",
//   } = req.query;

//   const users = await searchUsers({ username, firstname, lastname, email });

//   res.render("search", {
//     title: userSearchTitle,
//     users,
//     q: { username, firstname, lastname, email },
//   });
// };

exports.usersSearchGet = async (req, res) => {
  const {
    username = "",
    firstname = "",
    lastname = "",
    email = "",
  } = req.query;

  const noInput =
    !username.trim() && !firstname.trim() && !lastname.trim() && !email.trim();

  let users = [];

  if (!noInput) {
    // Only run SQL if the user typed something
    users = await searchUsers({ username, firstname, lastname, email });
  }

  // Build summary string for "No users found for..."
  const buildSummary = ({ username, firstname, lastname, email }) => {
    const parts = [];
    if (username) parts.push(`Username: ${username}`);
    if (firstname) parts.push(`First Name: ${firstname}`);
    if (lastname) parts.push(`Last Name: ${lastname}`);
    if (email) parts.push(`Email: ${email}`);
    return parts.join(" AND ");
  };

  const summary = buildSummary({ username, firstname, lastname, email });

  res.render("search", {
    title: userSearchTitle,
    users,
    q: { username, firstname, lastname, email },
    noInput,
    summary,
  });
};



// NO CHANGES! This controller does not access the database. It just renders a form page. No database calls = no await needed = does NOT need to be async.
exports.usersCreateGet = (req, res) => {
  res.render("createUser", {
    title: createUserTitle,
  });
};



// --- Create user (POST) ---
// We can pass an entire array of middleware validations to our controller.
// exports.usersCreatePost = [
//   validateUser,
//   (req, res) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).render("createUser", {
//         title: createUserTitle,
//         errors: errors.array(),
//       });
//     }
//     const { username, firstName, lastName, email, age, bio } = matchedData(req);
//     usersStorage.addUser({ username, firstName, lastName, email, age, bio });
//     res.redirect("/");
//   },
// ];

exports.usersCreatePost = [
  validateUser,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render("createUser", {
        title: createUserTitle,
        errors: errors.array(),
      });
    }

    // const { username, firstName, lastName, email, age, bio } = matchedData(req);
    
    // await addUser({ username, firstName, lastName, email, age, bio });

    const { username, firstname, lastname, email, age, bio } = matchedData(req);

    await addUser({ username, firstname, lastname, email, age, bio });

    res.redirect("/");
  },
];

// --- Update user (GET) ---
// exports.usersUpdateGet = (req, res) => {
//   const user = usersStorage.getUser(req.params.id);
//   res.render("updateUser", {
//     title: updateUserTitle,
//     user: user,
//   });
// };

exports.usersUpdateGet = async (req, res) => {
  const user = await getUser(req.params.id);
  res.render("updateUser", {
    title: updateUserTitle,
    user,
  });
};

// --- Update user (POST) ---
// exports.usersUpdatePost = [
//   validateUser,
//   (req, res) => {
//     const user = usersStorage.getUser(req.params.id);
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).render("updateUser", {
//         title: updateUserTitle,
//         user: user,
//         errors: errors.array(),
//       });
//     }
//     const { username, firstName, lastName, email, age, bio } = matchedData(req);
//     usersStorage.updateUser(req.params.id, {
//       username,
//       firstName,
//       lastName,
//       email,
//       age,
//       bio,
//     });
//     res.redirect("/");
//   },
// ];

exports.usersUpdatePost = [
  validateUser,
  async (req, res) => {
    const user = await getUser(req.params.id);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render("updateUser", {
        title: updateUserTitle,
        user,
        errors: errors.array(),
      });
    }

    // const { username, firstName, lastName, email, age, bio } = matchedData(req);
    const { username, firstname, lastname, email, age, bio } = matchedData(req);

    await updateUser(req.params.id, {
      username,
      // firstName,
      // lastName,
      firstname,
      lastname,
      email,
      age,
      bio,
    });

    res.redirect("/");
  },
];

// --- Delete user ---
// Tell the server to delete a matching user, if any. Otherwise, respond with an error.
// exports.usersDeletePost = (req, res) => {
//   usersStorage.deleteUser(req.params.id);
//   res.redirect("/");
// };

exports.usersDeletePost = async (req, res) => {
  await deleteUser(req.params.id);
  res.redirect("/");
};

