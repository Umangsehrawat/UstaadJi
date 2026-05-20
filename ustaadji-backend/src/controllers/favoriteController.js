const pool = require("../config/db");

exports.toggleFavorite = async (req, res) => {
  try {
    const userId = req.user.id;
    const { ad_id } = req.body;

    if (!ad_id) {
      return res.status(400).json({ message: "Ad ID is required" });
    }

    const existing = await pool.query(
      "SELECT * FROM favorites WHERE user_id = $1 AND ad_id = $2",
      [userId, ad_id]
    );

    if (existing.rows.length > 0) {
      await pool.query(
        "DELETE FROM favorites WHERE user_id = $1 AND ad_id = $2",
        [userId, ad_id]
      );

      return res.json({ message: "Removed from favorites", favorited: false });
    }

    await pool.query(
      "INSERT INTO favorites (user_id, ad_id) VALUES ($1, $2)",
      [userId, ad_id]
    );

    res.status(201).json({ message: "Added to favorites", favorited: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update favorite" });
  }
};

exports.getMyFavorites = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(
      `
      SELECT 
        ads.*,
        categories.name AS category_name,
        users.name AS seller_name,
        COALESCE(
          json_agg(ad_images.image_url) FILTER (WHERE ad_images.id IS NOT NULL),
          '[]'
        ) AS images
      FROM favorites
      JOIN ads ON favorites.ad_id = ads.id
      LEFT JOIN categories ON ads.category_id = categories.id
      LEFT JOIN users ON ads.user_id = users.id
      LEFT JOIN ad_images ON ads.id = ad_images.ad_id
      WHERE favorites.user_id = $1
      GROUP BY ads.id, categories.name, users.name, favorites.created_at
      ORDER BY favorites.created_at DESC
      `,
      [userId]
    );

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch favorites" });
  }
};