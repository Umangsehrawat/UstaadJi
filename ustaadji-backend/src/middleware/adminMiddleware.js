const pool = require("../config/db");

const adminMiddleware = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    console.log("ADMIN CHECK USER:", req.user);

    const result = await pool.query(
      "SELECT is_admin FROM users WHERE id = $1",
      [req.user.id]
    );

    if (result.rows.length === 0 || result.rows[0].is_admin !== true) {
      return res.status(403).json({ message: "Admin access required" });
    }

    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Admin check failed" });
  }
};

module.exports = adminMiddleware;