const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

// Public routes
router.post("/login", userController.loginUser);
router.post("/", userController.createUser);

// CRUD routes
router.get("/", userController.getAllUsers);
router.get("/:id", userController.getUserById);
router.put("/:id", userController.updateUser);
router.delete("/:id", userController.deleteUser);

module.exports = router;
