const bcrypt = require("bcryptjs");
const User = require("../models/userModel");

const asyncHandler = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

exports.getAllUsers = asyncHandler(async (req, res) => {
  User.getAll((err, results) => err ? res.status(500).json({ message: "Server error" }) : res.json(results));
});

exports.getUserById = asyncHandler(async (req, res) => {
  const id = req.params.id;
  User.getById(id, (err, results) => {
    if (err) return res.status(500).json({ message: "Server error" });
    if (!results || results.length === 0) return res.status(404).json({ message: "User not found" });
    res.json(results[0]);
  });
});

exports.createUser = asyncHandler(async (req, res) => {
  const { username, email, password, department, role } = req.body;
  if (!username || !email || !password || !department) return res.status(400).json({ message: "All required fields must be filled" });

  User.getByEmail(email, async (err, results) => {
    if (err) return res.status(500).json({ message: "Server error" });
    if (results.length > 0) return res.status(400).json({ message: "Email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = { username, email, password: hashedPassword, department, role };
    User.create(newUser, (err, result) => {
      if (err) return res.status(500).json({ message: "Server error" });
      res.status(201).json({ message: "User registered successfully", user: { id: result.insertId, username, email, department, role } });
    });
  });
});

exports.loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: "All fields are required" });

  User.getByEmail(email, async (err, results) => {
    if (err) return res.status(500).json({ message: "Server error" });
    if (!results || results.length === 0) return res.status(401).json({ message: "Invalid credentials" });

    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    res.json({ message: "Login successful", user: { id: user.id, username: user.username, email: user.email, department: user.department, role: user.role } });
  });
});

exports.updateUser = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const updates = req.body;
  if (!updates || Object.keys(updates).length === 0) return res.status(400).json({ message: "No fields provided to update" });

  if (updates.password && updates.password.trim() !== "") updates.password = await bcrypt.hash(updates.password, 10);
  else delete updates.password;

  User.update(id, updates, err => err ? res.status(500).json({ message: "Server error" }) : res.json({ message: "User updated successfully" }));
});

exports.deleteUser = asyncHandler(async (req, res) => {
  const id = req.params.id;
  User.delete(id, err => err ? res.status(500).json({ message: "Server error" }) : res.json({ message: "User deleted successfully" }));
});
