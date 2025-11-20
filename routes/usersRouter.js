// routes/usersRouter.js

const { Router } = require("express");
const usersController = require("../controllers/usersController");

const usersRouter = Router();

// List users
usersRouter.get("/", usersController.usersListGet);

// Search users
usersRouter.get("/search", usersController.usersSearchGet);

// Create user
usersRouter.get("/create", usersController.usersCreateGet);
usersRouter.post("/create", usersController.usersCreatePost);

// Update user
usersRouter.get("/:id/update", usersController.usersUpdateGet);
usersRouter.post("/:id/update", usersController.usersUpdatePost);

// Delete user
usersRouter.post("/:id/delete", usersController.usersDeletePost);

module.exports = usersRouter;

