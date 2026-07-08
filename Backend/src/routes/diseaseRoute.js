const express = require("express");
const {
  createDisease,
  getDiseases,
  getDiseaseById,
  updateDisease,
  deleteDisease,
} = require("../controllers/diseaseController");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

router.use(protect);

router.post("/", createDisease);
router.get("/", getDiseases);
router.get("/:id", getDiseaseById);
router.put("/:id", updateDisease);
router.delete("/:id", deleteDisease);

module.exports = router;