const express = require("express");
const { register, login, me } = require("../controllers/auth.controller");
const { protect } = require("../middleware/auth.middleware");
const {registerValidator,loginValidator}=require('../validators/authValidator')
const validateRequest=require("../validators/validateRequest")

const router = express.Router();

router.post("/register",registerValidator,validateRequest, register);
router.post("/login",loginValidator,validateRequest, login);
router.get("/me", protect, me);

module.exports = router;