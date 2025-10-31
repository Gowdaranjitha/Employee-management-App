const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

// Verify JWT
exports.verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }
  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid token" });
  }
};

// Role-based Access Middleware
exports.authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    const { role, id } = req.user;
    const targetId = req.params.id;

    // ✅ Admin → full access
    if (role === "Admin") return next();

    // ✅ Manager
    if (role === "Manager") {
      if (req.method === "GET") return next(); // can view all
      if (["PATCH", "PUT", "DELETE"].includes(req.method)) {
        if (targetId && targetId === id) return next();
        return res
          .status(403)
          .json({ message: "Managers can modify only their own data" });
      }
      return next();
    }

    // ✅ Employee
    if (role === "Employee") {
      if (req.method === "GET") {
        if (!targetId || targetId === id) return next(); // allow own data
        return res
          .status(403)
          .json({ message: "Employees can view only their own data" });
      }

      if (["PATCH", "PUT", "DELETE"].includes(req.method)) {
        if (targetId === id) return next();
        return res
          .status(403)
          .json({ message: "Employees can modify only their own data" });
      }
    }

    return res.status(403).json({ message: "Access denied" });
  };
};
