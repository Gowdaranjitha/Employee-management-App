// backend/index.js

const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const cors = require("cors");

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
app.post("/register", (req, res) => {
  const { username, password, email } = req.body;

  if (!username || !password || !email) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const sql = "INSERT INTO users (username, password, email) VALUES (?, ?, ?)";
  db.query(sql, [username, password, email], (err, result) => {
    if (err) {
      if (err.code === "ER_DUP_ENTRY") {
        return res.status(409).json({ error: "Username or email already exists" });
      }
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: "User registered successfully" });
  });
});

// Login user
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "Username and password are required" });
  }

  const sql = "SELECT * FROM users WHERE username = ? AND password = ?";
  db.query(sql, [username, password], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });

    if (results.length > 0) {
      res.json(results[0]); // return user details
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  });
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
