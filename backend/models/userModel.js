const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    department: { type: String, default: "" },
    role: {
      type: String,
      enum: ["Admin", "Manager", "Employee"],
      required: true,
      default: "Employee",
    },
  },
  { timestamps: true }
);

// use correct model + collection name
const User = mongoose.model("user", userSchema, "users");

module.exports = User;
