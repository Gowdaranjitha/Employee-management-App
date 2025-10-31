const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { verifyToken, authorizeRoles } = require("../middleware/authMiddleware");

// Public routes
router.post("/login", userController.loginUser);
router.post("/", userController.createUser);

// Protected routes
// Admin → can view all users
// Manager → can view all users
// Employee → can view only their details
router.get(
  "/",
  verifyToken,
  authorizeRoles("Admin", "Manager", "Employee"),
  userController.getAllUsers
);

// Admin / Manager / Employee → can view their own or assigned profiles
router.get(
  "/:id",
  verifyToken,
  authorizeRoles("Admin", "Manager", "Employee"),
  userController.getUserById
);

// Admin → can update anyone
// Manager / Employee → only their own data
router.put(
  "/:id",
  verifyToken,
  authorizeRoles("Admin", "Manager", "Employee"),
  userController.updateUser
);

router.patch(
  "/:id",
  verifyToken,
  authorizeRoles("Admin", "Manager", "Employee"),
  userController.updateUser
);

// Admin → can delete anyone
// Manager / Employee → can delete only themselves
router.delete(
  "/:id",
  verifyToken,
  authorizeRoles("Admin", "Manager", "Employee"),
  userController.deleteUser
);

module.exports = router;
