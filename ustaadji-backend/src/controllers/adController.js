const pool = require("../config/db");

exports.createAd = async (req, res) => {
  try {
    const {
      category_id,
      title,
      description,
      price,
      city,
      location,
      contact_phone,
    } = req.body;

    if (!category_id || !title || !description || !city) {
      return res.status(400).json({
        message: "Category, title, description, and city are required",
      });
    }

    const adResult = await pool.query(
      `INSERT INTO ads 
       (user_id, category_id, title, description, price, city, location, contact_phone, status)
VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'active')
       RETURNING *`,
      [
        req.user.id,
        category_id,
        title,
        description,
        price || null,
        city,
        location || null,
        contact_phone || null,
      ]
    );

    const ad = adResult.rows[0];

    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const imageUrl = file.path;

        await pool.query(
          "INSERT INTO ad_images (ad_id, image_url) VALUES ($1, $2)",
          [ad.id, imageUrl]
        );
      }
    }

    res.status(201).json({
      message: "Ad published successfully",
      ad,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create ad" });
  }
};

exports.getAds = async (req, res) => {
  try {
    const { search, city, category } = req.query;

    let query = `
      SELECT 
        ads.*,
        categories.name AS category_name,
        users.name AS seller_name,

CASE
  WHEN EXISTS (
    SELECT 1
    FROM favorites
    WHERE favorites.ad_id = ads.id
  )
  THEN true
  ELSE false
END AS is_favorited,
        COALESCE(
          json_agg(ad_images.image_url) FILTER (WHERE ad_images.id IS NOT NULL),
          '[]'
        ) AS images
      FROM ads
      LEFT JOIN categories ON ads.category_id = categories.id
      LEFT JOIN users ON ads.user_id = users.id
      LEFT JOIN ad_images ON ads.id = ad_images.ad_id
      WHERE ads.status = 'active'
    `;

    const values = [];
    let count = 1;

    if (search) {
      query += `
        AND (
          LOWER(ads.title) LIKE LOWER($${count})
          OR LOWER(ads.description) LIKE LOWER($${count})
        )
      `;
      values.push(`%${search}%`);
      count++;
    }

    if (city) {
  query += `
    AND (
      LOWER(ads.city) LIKE LOWER($${count})
      OR LOWER(ads.location) LIKE LOWER($${count})
    )
  `;
  values.push(`%${city}%`);
  count++;
}

    if (category) {
      query += ` AND categories.slug = $${count} `;
      values.push(category);
      count++;
    }

    query += `
      GROUP BY ads.id, categories.name, users.name
      ORDER BY ads.created_at DESC
    `;

    const result = await pool.query(query, values);

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch ads" });
  }
};

exports.getAdById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `SELECT 
        ads.*,
        categories.name AS category_name,
        users.name AS seller_name,
        users.email AS seller_email,
        COALESCE(
          json_agg(ad_images.image_url) FILTER (WHERE ad_images.id IS NOT NULL),
          '[]'
        ) AS images
      FROM ads
      LEFT JOIN categories ON ads.category_id = categories.id
      LEFT JOIN users ON ads.user_id = users.id
      LEFT JOIN ad_images ON ads.id = ad_images.ad_id
      WHERE ads.id = $1 AND ads.status = 'active'
      GROUP BY ads.id, categories.name, users.name, users.email`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Ad not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch ad" });
  }
};

exports.getMyAds = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT 
        ads.*,
        categories.name AS category_name,
        COALESCE(
          json_agg(ad_images.image_url) FILTER (WHERE ad_images.id IS NOT NULL),
          '[]'
        ) AS images
      FROM ads
      LEFT JOIN categories ON ads.category_id = categories.id
      LEFT JOIN ad_images ON ads.id = ad_images.ad_id
      WHERE ads.user_id = $1
      GROUP BY ads.id, categories.name
      ORDER BY ads.created_at DESC`,
      [req.user.id]
    );

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch user ads" });
  }
};

exports.deleteAd = async (req, res) => {
  try {
    const { id } = req.params;

    // check ownership
    const adCheck = await pool.query(
      "SELECT * FROM ads WHERE id = $1",
      [id]
    );

    if (adCheck.rows.length === 0) {
      return res.status(404).json({
        message: "Ad not found",
      });
    }

    const ad = adCheck.rows[0];

    if (ad.user_id !== req.user.id) {
      return res.status(403).json({
        message: "Unauthorized",
      });
    }

    // delete images first
    await pool.query(
      "DELETE FROM ad_images WHERE ad_id = $1",
      [id]
    );

    // delete ad
    await pool.query(
      "DELETE FROM ads WHERE id = $1",
      [id]
    );

    res.json({
      message: "Ad deleted successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to delete ad",
    });
  }
};

exports.updateAd = async (req, res) => {
  try {
    const { id } = req.params;
    const { category_id, title, description, price, city, location, contact_phone } = req.body;

    const adCheck = await pool.query("SELECT * FROM ads WHERE id = $1", [id]);

    if (adCheck.rows.length === 0) {
      return res.status(404).json({ message: "Ad not found" });
    }

    if (adCheck.rows[0].user_id !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const result = await pool.query(
      `UPDATE ads
       SET category_id = $1,
           title = $2,
           description = $3,
           price = $4,
           city = $5,
           location = $6,
           contact_phone = $7,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $8
       RETURNING *`,
      [category_id, title, description, price || null, city, location || null, contact_phone || null, id]
    );

    res.json({
      message: "Ad updated successfully",
      ad: result.rows[0],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update ad" });
  }
};