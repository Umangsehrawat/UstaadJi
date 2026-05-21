const express = require("express");
const router = express.Router();

const adController = require("../controllers/adController");
const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");

router.get("/", adController.getAds);

router.get("/my-ads", protect, adController.getMyAds);

router.delete("/:id", protect, adController.deleteAd);

router.put("/:id", protect, adController.updateAd);

router.get("/:id", adController.getAdById);

router.post(
  "/",
  protect,
  upload.array("images", 5),
  adController.createAd
);

module.exports = router;