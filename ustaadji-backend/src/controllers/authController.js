const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../config/db");

exports.register = async (req, res) => {
  try {
    const { name, phone, password, city } = req.body;

    if (!name || !phone || !password) {
      return res.status(400).json({ message: "Name, phone, and password are required" });
    }

    if (!/^[6-9]\d{9}$/.test(phone)) {
      return res.status(400).json({ message: "Enter a valid 10-digit Indian mobile number" });
    }

    const existingUser = await pool.query("SELECT id FROM users WHERE phone = $1", [phone]);

    if (existingUser.rows.length > 0) {
      return res.status(400).json({ message: "Phone number already registered" });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO users (name, phone, password_hash, city)
       VALUES ($1, $2, $3, $4)
       RETURNING id, name, phone, city, role`,
      [name, phone, passwordHash, city || null]
    );

    const user = result.rows[0];

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({ user, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Registration failed" });
  }
};

exports.login = async (req, res) => {
  try {
    const { phone, password } = req.body;

    if (!phone || !password) {
      return res.status(400).json({ message: "Phone and password are required" });
    }

    const result = await pool.query("SELECT * FROM users WHERE phone = $1", [phone]);

    if (result.rows.length === 0) {
      return res.status(401).json({ message: "Invalid phone number or password" });
    }

    const user = result.rows[0];

    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid phone number or password" });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      user: {
        id: user.id,
        name: user.name,
        phone: user.phone,
        city: user.city,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Login failed" });
  }
};