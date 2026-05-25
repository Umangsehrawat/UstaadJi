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

const getAllAds = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT ads.id, ads.title, ads.city, ads.status, ads.created_at,
             categories.name AS category_name,
             users.name AS seller_name,
             users.phone AS seller_phone,
             COALESCE(json_agg(ad_images.image_url) FILTER (WHERE ad_images.id IS NOT NULL), '[]') AS images
      FROM ads
      LEFT JOIN categories ON ads.category_id = categories.id
      LEFT JOIN users ON ads.user_id = users.id
      LEFT JOIN ad_images ON ads.id = ad_images.ad_id
      GROUP BY ads.id, categories.name, users.name, users.phone
      ORDER BY ads.created_at DESC
    `);
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch ads" });
  }
};

const deleteAd = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM ad_images WHERE ad_id = $1", [id]);
    await pool.query("DELETE FROM reports WHERE ad_id = $1", [id]);
    await pool.query("DELETE FROM ads WHERE id = $1", [id]);
    res.json({ message: "Ad deleted by admin" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete ad" });
  }
};

const dismissReport = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM reports WHERE id = $1", [id]);
    res.json({ message: "Report dismissed" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to dismiss report" });
  }
};

module.exports = {
  getDashboardStats,
  getReports,
  getAllAds,
  deleteAd,
  dismissReport,
};

