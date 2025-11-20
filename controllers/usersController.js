// controllers/usersController.js

// Let’s add a few methods to our usersController.js for validating and sanitizing our form to get the type of data we want. From *HERE*
const { body, validationResult, matchedData } = require("express-validator");
// We retrieve all validated data via the matchedData() function to ensure all the data we get will include any sanitization done (such as trimmed data).
const usersStorage = require("../storages/usersStorage");

// Error messages
const alphaErr = "must only contain letters.";
const lengthErr = "must be between 1 and 10 characters.";
const emailErr = "Please enter a valid email address."
const numberErr = "must be a number between 18 and 120.";
const bioLengthErr = "cannot exceed 200 characters.";

// Title variables
const userListTitle = "User list";
const userSearchTitle = "Search users";
const createUserTitle = "Create user";
const updateUserTitle = "Update user";

const validateUser = [
  body("firstName")
    .trim()
    .isAlpha()
    .withMessage(`First name ${alphaErr}`)
    .isLength({ min: 1, max: 15 })
    .withMessage(`First name ${lengthErr}`),
  body("lastName")
    .trim()
    .isAlpha()
    .withMessage(`Last name ${alphaErr}`)
    .isLength({ min: 1, max: 15 })
    .withMessage(`Last name ${lengthErr}`),
  body("email")
    .trim()
    .isEmail()
    .withMessage(emailErr)
    .isLength({ min: 1, max: 20 })
    .withMessage(`Email ${lengthErr}`),
  body("age")
    .optional({ values: "falsy" })
    .trim()
    .isInt({ min: 18, max: 120 })
    .withMessage(`Age ${numberErr}`),
  body("bio")
    .optional({ values: "falsy" })
    .trim()
    .isLength({ min: 0, max: 200 })
    .withMessage(`Bio ${bioLengthErr}`),
];

// --- List users ---
exports.usersListGet = (req, res) => {
  res.render("index", {
    title: userListTitle,
    users: usersStorage.getUsers(),
  });
};

// --- Search users ---
// exports.usersSearchGet = (req, res) => {
//   res.render("search", {
//     title: userSearchTitle,
//     users: usersStorage.searchUsers(req.query.q),
//   });
// };

// --- Search users ---
// exports.usersSearchGet = (req, res) => {
//   const q = req.query.q ? req.query.q.toLowerCase() : "";

//   const users = usersStorage.getUsers();

//   const filtered = users.filter((user) => {
//     return (
//       user.firstName.toLowerCase().includes(q) ||
//       user.lastName.toLowerCase().includes(q) ||
//       user.email.toLowerCase().includes(q)
//     );
//   });

//   res.render("search", {
//     title: userSearchTitle,
//     users: filtered,
//     q: req.query.q || "",
//   });
// };

exports.usersSearchGet = (req, res) => {
  const { firstName = "", lastName = "", email = "" } = req.query;

  const f = firstName.toLowerCase();
  const l = lastName.toLowerCase();
  const e = email.toLowerCase();

  const users = usersStorage.getUsers();

  const filtered = users.filter((user) => {
    const matchFirst = f && user.firstName.toLowerCase().includes(f);
    const matchLast = l && user.lastName.toLowerCase().includes(l);
    const matchEmail = e && user.email.toLowerCase().includes(e);

    return matchFirst || matchLast || matchEmail;
  });

  res.render("search", {
    title: userSearchTitle,
    users: filtered,
    q: { firstName, lastName, email }, // for repopulating form
  });
};



// --- Create user (GET) ---
exports.usersCreateGet = (req, res) => {
  res.render("createUser", {
    title: createUserTitle,
  });
};

// --- Create user (POST) ---
// We can pass an entire array of middleware validations to our controller.
exports.usersCreatePost = [
  validateUser,
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render("createUser", {
        title: createUserTitle,
        errors: errors.array(),
      });
    }
    const { firstName, lastName, email, age, bio } = matchedData(req);
    usersStorage.addUser({ firstName, lastName, email, age, bio });
    res.redirect("/");
  }
];

// *to HERE*

// --- Update user (GET) ---
exports.usersUpdateGet = (req, res) => {
  const user = usersStorage.getUser(req.params.id);
  res.render("updateUser", {
    title: updateUserTitle,
    user: user,
  });
};

// --- Update user (POST) ---
exports.usersUpdatePost = [
  validateUser,
  (req, res) => {
    const user = usersStorage.getUser(req.params.id);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render("updateUser", {
        title: updateUserTitle,
        user: user,
        errors: errors.array(),
      });
    }
    const { firstName, lastName, email, age, bio } = matchedData(req);
    usersStorage.updateUser(req.params.id, { firstName, lastName, email, age, bio });
    res.redirect("/");
  },
];

// --- Delete user ---
// Tell the server to delete a matching user, if any. Otherwise, respond with an error.
exports.usersDeletePost = (req, res) => {
  usersStorage.deleteUser(req.params.id);
  res.redirect("/");
};




