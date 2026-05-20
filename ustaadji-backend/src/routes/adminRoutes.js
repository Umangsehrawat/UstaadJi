const express = require("express");
const router = express.Router();

const {
  getDashboardStats,
  getReports,
} = require("../controllers/adminController");

const { protect } = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

router.get("/stats", protect, adminMiddleware, getDashboardStats);
router.get("/reports", protect, adminMiddleware, getReports);

module.exports = router;