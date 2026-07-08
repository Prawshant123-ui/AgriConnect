const express = require("express");
const {
  createCrop,
  getCropsByFarm,
  getCropById,
  updateCrop,
  deleteCrop,
} = require("../controllers/cropController");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

router.use(protect);

router.post("/farm/:farmId", createCrop);
router.get("/farm/:farmId", getCropsByFarm);
router.get("/:id", getCropById);
router.put("/:id", updateCrop);
router.delete("/:id", deleteCrop);

module.exports = router;