const express = require("express");
const router = express.Router();

const {
  startExam,
  saveAnswer,
  submitExam,
  getMyResults
} = require("../controllers/exam.controller");

const {
  protect,
  authorizeRoles
} = require("../middleware/authMiddleware");


// 🟢 Start / Resume Exam (Student only)
router.post(
  "/start",
  protect,
  authorizeRoles("student"),
  startExam
);

// 🟡 Save answer (autosave) (Student only)
router.patch(
  "/save",
  protect,
  authorizeRoles("student"),
  saveAnswer
);

// 🔴 Submit exam (Student only)
router.post(
  "/submit",
  protect,
  authorizeRoles("student"),
  submitExam
);

module.exports = router;
