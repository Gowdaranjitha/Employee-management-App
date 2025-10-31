const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

//Generate JWT Token
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );
};

//Register / Create User
exports.createUser = async (req, res) => {
  try {
    const { username, email, password, role, department } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "Email already registered" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      department,
      role: role || "Employee",
    });

    await newUser.save();
    res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error creating user", error: err.message });
  }
};

//Login User
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(401).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    const token = generateToken(user);

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Error logging in", error: err.message });
  }
};

//Get All Users (Admin only)
exports.getAllUsers = async (req, res) => {
  try {
    const { role, id } = req.user; // extracted from JWT token

    let users;

    if (role === "Admin") {
      // ✅ Admin: Can view everyone
      users = await User.find({}, "username email department role createdAt");
    } else if (role === "Manager") {
      // ✅ Manager: Can view everyone (read-only)
      users = await User.find({}, "username email department role createdAt");
    } else if (role === "Employee") {
      // ✅ Employee: Can view only self
      users = await User.find({ _id: id }, "username email department role createdAt");
    }

    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Error fetching users", error: err.message });
  }
};


//Get Single User (Admin, Manager, Employee)
exports.getUserById = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Error fetching user", error: err.message });
  }
};

//Update User (with role change logic)
exports.updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const { username, email, password, role, department } = req.body;
    const { id: requesterId, role: requesterRole } = req.user;

    const existingUser = await User.findById(userId);
    if (!existingUser) return res.status(404).json({ message: "User not found" });

    //Role change logic
    let newRole = existingUser.role;
    if (role) {
      if (requesterRole === "Admin") {
        newRole = role; // Admin can change anyone’s role
      } else if (["Manager", "Employee"].includes(requesterRole)) {
        if (requesterId === userId) {
          newRole = role; // Can change own role only
        } else {
          return res.status(403).json({ message: "Access Denied: You can only modify your own role" });
        }
      }
    }

    //Restrict updates: Non-admins can only update themselves
    if (requesterRole !== "Admin" && requesterId !== userId) {
      return res.status(403).json({ message: "Access Denied: You can update only your own data" });
    }

    //Hash password if changed
    let hashedPassword = existingUser.password;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    existingUser.username = username || existingUser.username;
    existingUser.email = email || existingUser.email;
    existingUser.password = hashedPassword;
    existingUser.role = newRole;
    existingUser.department = department || existingUser.department;

    await existingUser.save();

    res.json({ message: "User updated successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error updating user", error: err.message });
  }
};

//Delete User
exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const { id: requesterId, role: requesterRole } = req.user;

    // Admin can delete anyone, others only themselves
    if (requesterRole !== "Admin" && requesterId !== userId) {
      return res.status(403).json({ message: "Access Denied: You can delete only your own profile" });
    }

    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser)
      return res.status(404).json({ message: "User not found" });

    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting user", error: err.message });
  }
};
