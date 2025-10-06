const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const cors = require("cors");
const bcrypt = require("bcryptjs");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// MySQL connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Ranjithaa@26",
  database: "employee_app",
});

db.connect((err) => {
  if (err) throw err;
  console.log("Connected to MySQL database!");
});

// -------------------- ROUTES -------------------- //

// REGISTER
app.post("/register", async (req, res) => {
  let { username, password, email } = req.body;
  username = username.trim();
  email = email.trim();
  password = password.trim();

  if (!username || !password || !email) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    // Email must be unique
    const [existing] = await db
      .promise()
      .query("SELECT * FROM users WHERE email = ?", [email]);
    if (existing.length > 0) {
      return res.status(409).json({ error: "Email already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user
    await db
      .promise()
      .query(
        "INSERT INTO users (username, password, email) VALUES (?, ?, ?)",
        [username, hashedPassword, email]
      );

    res.json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// LOGIN
app.post("/login", async (req, res) => {
  let { username, password } = req.body;
  username = username.trim();
  password = password.trim();

  if (!username || !password) {
    return res.status(400).json({ error: "Username and password are required" });
  }

  try {
    // Case-insensitive username
    const [results] = await db
      .promise()
      .query("SELECT * FROM users WHERE LOWER(username) = LOWER(?)", [username]);

    if (results.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const user = results[0];

    // Compare password
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    delete user.password;
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET USERS
app.get("/users", (req, res) => {
  db.query("SELECT id, username, email FROM users", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// START SERVER
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
