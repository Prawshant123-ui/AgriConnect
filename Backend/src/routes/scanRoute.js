const express = require("express");
const { createScan, getScansByCrop, getScanById } = require("../controllers/scanController");
const { protect } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/uploadMiddleware");

const router = express.Router();

router.use(protect);

router.post("/crop/:cropId", upload.single("image"), createScan);
router.get("/crop/:cropId", getScansByCrop);
router.get("/:id", getScanById);

module.exports = router;