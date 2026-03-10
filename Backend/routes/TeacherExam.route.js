const express = require("express");

const {
  getTeacherExams
} = require("../controllers/teacher.controller");

const {
  protect,
  authorizeRoles
} = require("../middleware/authMiddleware");

const router = express.Router();

// Teacher + HOD can view teacher exams
router.get(
  "/exams",
  protect,
  authorizeRoles("teacher"),
  getTeacherExams
);

module.exports = router;