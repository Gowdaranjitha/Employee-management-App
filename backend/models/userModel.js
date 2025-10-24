const db = require("../config/db");

const User = {
  getAll: (callback) => db.query("SELECT id, username, email, department, role FROM users", callback),
  getById: (id, callback) => db.query("SELECT id, username, email, department, role FROM users WHERE id = ?", [id], callback),
  getByEmail: (email, callback) => db.query("SELECT * FROM users WHERE email = ?", [email], callback),
  create: (user, callback) => {
    const { username, email, password, department, role } = user;
    db.query("INSERT INTO users (username, email, password, department, role) VALUES (?, ?, ?, ?, ?)",
      [username, email, password, department, role], callback);
  },
  update: (id, userData, callback) => {
    const fields = Object.keys(userData).map(key => `${key} = ?`).join(", ");
    const values = Object.values(userData);
    values.push(id);
    db.query(`UPDATE users SET ${fields} WHERE id = ?`, values, callback);
  },
  delete: (id, callback) => db.query("DELETE FROM users WHERE id=?", [id], callback),
};

module.exports = User;
