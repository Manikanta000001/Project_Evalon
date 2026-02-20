const express = require("express");
const router = express.Router();

const {
getMyResults
} = require("../controllers/exam.controller");

const {
  protect,
  isStudent
} = require("../middleware/authMiddleware");



router.get("/my", protect, isStudent, getMyResults);


module.exports = router;
