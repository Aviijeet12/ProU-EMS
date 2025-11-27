const jwt = require("jsonwebtoken");

function generateToken(userId) {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET || "supersecretkey",
    {
      expiresIn: process.env.JWT_EXPIRES || "1d",
    }
  );
}

module.exports = generateToken;
