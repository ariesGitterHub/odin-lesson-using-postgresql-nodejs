// Most simple forms will use the Content-Type: application/x-www-form-urlencoded HTTP header when sending data to the server. Express, however, can’t natively parse that data. We can use the express.urlencoded() middleware to handle this for us and automatically set form’s data to the req.body field. When extended is false, our server will only accept a string or an array of data, so we set it to true for some added flexibility. Note that if the Content-Type doesn’t match application/x-www-form-urlencoded, then your server will show the data as an empty object {}.

require('dotenv').config(); // Load environment variables

// --- 1. Imports (at the very top) ---
const express = require("express");
const path = require("node:path");
const usersRouter = require("./routes/usersRouter");

// --- 2. Create the app ---
const app = express();

// --- 3. App configuration ---
app.use(express.static(__dirname + "/public"));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// --- 4. Middleware ---
app.use(express.urlencoded({ extended: true }));
// app.use(express.json()); // optional but recommended

// These below, don't go here. Those two lines absolutely belong in this router file (usersRouter.js), not in app.js. app.js should only mount routers (like app.use("/users", usersRouter)).
// The route definitions themselves (get, post, etc.) belong in the router file for that feature (in this case, the "users" feature).
// usersRouter.get("/:id/update", usersController.usersUpdateGet);
// usersRouter.post("/:id/update", usersController.usersUpdatePost);

// --- 5. Routers (mount here) ---
app.use("/", usersRouter);

// --- 6. Server startup ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, (error) => {
  if (error) {
    throw error;
  }
  console.log(`Express app listening on port ${PORT}!`);
});
