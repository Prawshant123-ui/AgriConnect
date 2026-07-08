const jwt = require("jsonwebtoken");

const signToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET_KEY,
    {
      expiresIn: process.env.JWT_EXPIRY || "7d",
    },
  );
};

const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET_KEY);
};


module.exports={signToken,verifyToken}