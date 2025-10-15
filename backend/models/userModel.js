const db = require("../config/db");

const User = {
  getAll: (callback) => {
    db.query("SELECT id, username FROM users", callback);
  },

  getById: (id, callback) => {
    db.query("SELECT id, username FROM users WHERE id = ?", [id], callback);
  },

  getByUsername: (username, callback) => {
    db.query("SELECT * FROM users WHERE username = ?", [username], callback);
  },

  create: (user, callback) => {
    const { username, password } = user;
    db.query(
      "INSERT INTO users (username, password) VALUES (?, ?)",
      [username, password],
      callback
    );
  },

  update: (id, user, callback) => {
    const { username, password } = user;
    db.query(
      "UPDATE users SET username=?, password=? WHERE id=?",
      [username, password, id],
      callback
    );
  },

  delete: (id, callback) => {
    db.query("DELETE FROM users WHERE id=?", [id], callback);
  },
};

module.exports = User;
