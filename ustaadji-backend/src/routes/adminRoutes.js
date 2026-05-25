const express = require("express");
const router = express.Router();

const { getDashboardStats, getReports, deleteAd, dismissReport } = require("../controllers/adminController");
const { protect } = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

router.get("/stats", protect, adminMiddleware, getDashboardStats);
router.get("/reports", protect, adminMiddleware, getReports);
router.delete("/ads/:id", protect, adminMiddleware, deleteAd);
router.delete("/reports/:id", protect, adminMiddleware, dismissReport);

module.exports = router;
