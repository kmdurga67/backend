const jwt = require("jsonwebtoken");
const db = require("../config/database");

const authMiddleware = async (req, res, next) => {
  try {
    let token = req.cookies.adminToken ||
      (req.header('Authorization') ? req.header('Authorization').split(' ')[1] : null);

    if (!token) {
      return res.status(401).json({
        error: "Authentication required",
        message: "No authentication token provided"
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const { rows } = await db.query(
      "SELECT id, email, name, last_login FROM admins WHERE id = $1",
      [decoded.id]
    );

    if (rows.length === 0) {
      return res.status(403).json({
        error: "Forbidden",
        message: "Admin account not found"
      });
    }

    req.admin = rows[0];
    next();
  } catch (err) {
    console.error("Authentication error:", err.message);

    if (err.name === "TokenExpiredError") {
      return res.status(401).json({
        error: "Session expired",
        message: "Your session has expired. Please log in again."
      });
    }

    if (err.name === "JsonWebTokenError") {
      return res.status(401).json({
        error: "Invalid token",
        message: "Authentication token is invalid"
      });
    }

    res.status(500).json({
      error: "Authentication failed",
      message: "An error occurred during authentication"
    });
  }
};

module.exports = authMiddleware;