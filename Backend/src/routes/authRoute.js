const express = require("express");
const { register, login, me } = require("../controllers/authController");
const { protect } = require("../middlewares/authMiddleware");
const {
  registerValidator,
  loginValidator,
} = require("../validators/authValidator");
const validateRequest = require("../validators/validateRequest");
const { loginLimiter } = require("../services/rateLimiter");

const router = express.Router();

router.post("/register", registerValidator, validateRequest, register);
router.post("/login", loginLimiter, loginValidator, validateRequest, login);
router.get("/me", protect, me);

module.exports = router;
