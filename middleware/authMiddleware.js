const jwt = require("jsonwebtoken");
const db = require("../config/database");

const authMiddleware = async (req, res, next) => {
  try {
    // const token = req.header('Authorization')?.replace('Bearer ', '');
    // const token = req.header('Authorization')?.split(' ')[1]
    let token = req.cookies.adminToken;
    
    if (!token) {
      const authHeader = req.header('Authorization');
      if (authHeader) {
        token = authHeader.split(' ')[1];
      }
    }

    console.log(token);

    if (!token) {
      console.log("No token provided");
      return res.status(401).json({ error: "Unauthorized - No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    console.log("Decoded Token:", decoded);

    const { rows } = await db.query("SELECT * FROM admins WHERE id = $1", [
      decoded.id,
    ]);

    if (rows.length === 0) {
      console.log("Admin not found in DB");
      return res.status(403).json({ error: "Forbidden - Admin not found" });
    }

    req.admin = rows[0];
    next();
  } catch (err) {
    console.error("Auth Middleware Error:", err.message);

    if (err.name === "TokenExpiredError") {
      return res
        .status(401)
        .json({ error: "Session expired. Please log in again." });
    }

    return res.status(401).json({ error: "Invalid token" });
  }
};

module.exports = authMiddleware;
