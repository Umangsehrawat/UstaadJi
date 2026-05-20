const pool = require("../config/db");

exports.createReport = async (req, res) => {
  try {
    const { ad_id, reason, message } = req.body;

    if (!ad_id || !reason) {
      return res.status(400).json({
        message: "Ad and reason are required",
      });
    }

    await pool.query(
      `
      INSERT INTO reports (ad_id, reporter_id, reason, message)
      VALUES ($1, $2, $3, $4)
      `,
      [ad_id, req.user.id, reason, message || null]
    );

    res.status(201).json({
      message: "Report submitted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to submit report",
    });
  }
};