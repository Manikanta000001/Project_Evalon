const express = require("express");
const {
  signup,
  signin,
  getMe,
  updateMe,
} = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// public
router.post("/signup", signup);
router.post("/signin", signin);

// protected
router.get("/profile", protect, getMe);
router.put("/profile", protect, updateMe);

module.exports = router;
