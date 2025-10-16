const bcrypt = require("bcryptjs");
const User = require("../models/userModel");

const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

// Get all users
exports.getAllUsers = asyncHandler(async (req, res) => {
  User.getAll((err, results) => {
    if (err) {
      console.error("DB Error (getAllUsers):", err);
      return res.status(500).json({ message: "Server error" });
    }
    res.json(results);
  });
});

// Get user by ID
exports.getUserById = asyncHandler(async (req, res) => {
  const id = req.params.id;
  User.getById(id, (err, results) => {
    if (err) {
      console.error("DB Error (getUserById):", err);
      return res.status(500).json({ message: "Server error" });
    }
    if (!results || results.length === 0)
      return res.status(404).json({ message: "User not found" });
    res.json(results[0]);
  });
});

// Register user
exports.createUser = asyncHandler(async (req, res) => {
  const { username, email, password, department, role } = req.body;

  if (!username || !email || !password || !department)
    return res.status(400).json({ message: "All required fields must be filled" });

  // Check if email already exists
  User.getByEmail(email, async (err, results) => {
    if (err) {
      console.error("DB Error (check email):", err);
      return res.status(500).json({ message: "Server error" });
    }
    if (results.length > 0)
      return res.status(400).json({ message: "Email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = { username, email, password: hashedPassword, department, role };

    User.create(newUser, (err, result) => {
      if (err) {
        console.error("DB Error (createUser):", err);
        return res.status(500).json({ message: "Server error" });
      }

      res.status(201).json({
        message: "User registered successfully",
        user: { id: result.insertId, username, email, department, role },
      });
    });
  });
});

// Login user by username
exports.loginUser = asyncHandler(async (req, res) => {
  console.log("Request body:", req.body);
  const { username, password } = req.body;

  if (!username || !password)
    return res.status(400).json({ message: "All fields are required" });

  User.getByUsername(username, async (err, results) => {
    if (err) {
      console.error("DB Error (loginUser):", err);
      return res.status(500).json({ message: "Server error" });
    }

    if (!results || results.length === 0)
      return res.status(401).json({ message: "Invalid credentials" });

    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    res.json({
      message: "Login successful",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        department: user.department,
        role: user.role,
      },
    });
  });
});

// Update user
exports.updateUser = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const { username, email, password, department, role } = req.body;

  if (!username || !email || !password || !department)
    return res.status(400).json({ message: "All fields are required" });

  const hashedPassword = await bcrypt.hash(password, 10);
  const updatedUser = { username, email, password: hashedPassword, department, role };

  User.update(id, updatedUser, (err) => {
    if (err) {
      console.error("DB Error (updateUser):", err);
      return res.status(500).json({ message: "Server error" });
    }

    res.json({ message: "User updated successfully" });
  });
});

// Delete user
exports.deleteUser = asyncHandler(async (req, res) => {
  const id = req.params.id;

  User.delete(id, (err) => {
    if (err) {
      console.error("DB Error (deleteUser):", err);
      return res.status(500).json({ message: "Server error" });
    }

    res.json({ message: "User deleted successfully" });
  });
});