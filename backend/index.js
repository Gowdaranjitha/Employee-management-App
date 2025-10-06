// backend/index.js

const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const cors = require("cors");
const bcrypt = require("bcryptjs"); // for password hashing

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MySQL connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Ranjithaa@26", 
  database: "employee_app"
});

db.connect(err => {
  if (err) throw err;
  console.log("Connected to MySQL database!");
});

// -------------------- ROUTES -------------------- //

// Register a new user
app.post("/register", async (req, res) => {
  const { username, password, email } = req.body;

  if (!username || !password || !email) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    // Step 1: Check if email already exists
    const [existing] = await db.promise().query("SELECT * FROM users WHERE email = ?", [email]);
    if (existing.length > 0) {
      return res.status(409).json({ error: "Email already exists" });
    }

    // Step 2: Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Step 3: Insert new user
    const sql = "INSERT INTO users (username, password, email) VALUES (?, ?, ?)";
    await db.promise().query(sql, [username, hashedPassword, email]);

    res.json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Login user
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "Username and password are required" });
  }

  try {
    const [results] = await db.promise().query("SELECT * FROM users WHERE username = ?", [username]);
    
    if (results.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const user = results[0];

    // Compare password
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Remove password from response
    delete user.password;

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all users (Dashboard)
app.get("/users", (req, res) => {
  const sql = "SELECT id, username, email FROM users";
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// -------------------- START SERVER -------------------- //
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
