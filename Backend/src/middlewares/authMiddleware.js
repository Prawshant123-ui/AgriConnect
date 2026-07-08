const { verifyToken } = require("../utils/jwt");

const protect = (req, res, next) => {
  try {
    const header = req.headers.authorization;

    if (!header || !header.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Access token is missing." });
    }

    const token = header.split(" ")[1];
    const decoded = verifyToken(token);

    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token." });
  }
};

module.exports = { protect };
