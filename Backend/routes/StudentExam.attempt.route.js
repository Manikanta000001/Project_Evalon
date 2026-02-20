const express = require("express");
const router = express.Router();

const {
  startExam,
  saveAnswer,
  submitExam,getMyResults
} = require("../controllers/exam.controller");

const {
  protect,
  isStudent
} = require("../middleware/authMiddleware");

// 🟢 Start / Resume Exam
router.post("/start", protect, isStudent, startExam);

// 🟡 Save answer (autosave)
router.patch("/save", protect, isStudent, saveAnswer);

// 🔴 Submit exam
router.post("/submit", protect, isStudent, submitExam);



module.exports = router;
