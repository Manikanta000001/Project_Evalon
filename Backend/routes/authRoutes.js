const express = require("express");
const {
  signup,
  signin,
  getMe,
  
} = require("../controllers/authController");
const { protect , isAdmin} = require("../middleware/authMiddleware");

const router = express.Router();

// public
router.post("/signin", signin);

// protected
router.post("/signup", protect, isAdmin, signup);
router.get("/profile", protect, getMe);
// router.put("/profile", protect, updateMe);

module.exports = router;
