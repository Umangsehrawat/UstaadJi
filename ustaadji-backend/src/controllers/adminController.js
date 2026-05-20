const pool = require("../config/db");

const getDashboardStats = async (req, res) => {
  try {
    const users = await pool.query(
      "SELECT COUNT(*) FROM users"
    );

    const ads = await pool.query(
      "SELECT COUNT(*) FROM ads"
    );

    const messages = await pool.query(
      "SELECT COUNT(*) FROM messages"
    );

    const reports = await pool.query(
      "SELECT COUNT(*) FROM reports"
    );

    res.json({
      totalUsers: users.rows[0].count,
      totalAds: ads.rows[0].count,
      totalMessages: messages.rows[0].count,
      totalReports: reports.rows[0].count,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

const getReports = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        reports.id,
        reports.reason,
        reports.message,
        reports.created_at,
        ads.id AS ad_id,
        ads.title AS ad_title,
        ads.city,
        users.name AS seller_name
      FROM reports
      LEFT JOIN ads ON reports.ad_id = ads.id
      LEFT JOIN users ON ads.user_id = users.id
      ORDER BY reports.created_at DESC
    `);

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch reports" });
  }
};

module.exports = {
  getDashboardStats,
  getReports,
};

