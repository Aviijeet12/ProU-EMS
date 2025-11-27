const express = require("express");
const router = express.Router();

const {
  register,
  login,
  validate,
} = require("../controllers/authController");

const { authMiddleware } = require("../middleware/authMiddleware");

router.post("/register", register);
router.post("/login", login);

// validate returns { success, user, role }
router.get("/validate", authMiddleware, validate);

module.exports = router;
