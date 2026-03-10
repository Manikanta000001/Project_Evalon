const express = require("express");
const router = express.Router();

const {
  getMyResults
} = require("../controllers/exam.controller");

const {
  protect,
  authorizeRoles
} = require("../middleware/authMiddleware");


// Only students can view their results
router.get(
  "/my",
  protect,
  authorizeRoles("student"),
  getMyResults
);

module.exports = router;