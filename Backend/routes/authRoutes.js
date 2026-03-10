const express = require("express");

const {
  signup,
  signin,
  getMe,
  changePassword,sendResetOtp,verifyResetOtp,resetPasswordWithOtp
} = require("../controllers/authController");

const {
  protect,
  authorizeRoles
} = require("../middleware/authMiddleware");

const router = express.Router();


router.post("/signin", signin);
router.post("/change-password", protect, changePassword);
router.post("/send-reset-otp", protect, sendResetOtp);
router.post("/verify-reset-otp", protect, verifyResetOtp);
router.post("/reset-password-otp", protect, resetPasswordWithOtp);




// Only Admin can create accounts
router.post(
  "/signup",
  protect,
  authorizeRoles("admin"),
  signup
);

// Logged-in user profile
router.get(
  "/profile",
  protect,
  getMe
);

module.exports = router;