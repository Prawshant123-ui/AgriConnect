const rateLimit = require("express-rate-limit");

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 200,
  message: "Too many requests, try again later!",
});

const loginLimiter = rateLimit({
  windowMs: 60 * 1000, 
  max: 5,
  message: "Too many login attempts",
});

module.exports = { apiLimiter, loginLimiter };