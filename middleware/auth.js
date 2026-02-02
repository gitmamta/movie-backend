const jwt = require("jsonwebtoken");
const User = require("../model/User");

const auth = (roles = []) => async (req, res, next) => {
  // allow single string role
  roles = typeof roles === "string" ? [roles] : roles;

  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);
    if (!user) return res.status(401).json({ message: "User not found" });

    if (roles.length && !roles.includes(user.role)) {
      return res.status(403).json({ message: "Access denied" });
    }

    req.user = user;
    next();
  } catch (err) {
    if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Invalid or expired token" });
    }
    console.error("AUTH ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = auth;
