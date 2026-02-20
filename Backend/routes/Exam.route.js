const express = require("express");

const {
    createExam,
    getAvailableExams,
    deleteExam,
    getExamReport
} = require("../controllers/exam.controller");

const {
    protect
} = require("../middleware/authMiddleware");
const { runAllTestCases }=require("../controllers/Testcase.controller")

const router = express.Router();
router.post("/exams", protect, createExam);
router.get("/exams/available", protect, getAvailableExams);


router.delete("/exams/:examId", protect, deleteExam);

// exam reports generation route
router.get("/exams/:examId/reports", protect, getExamReport);


// testcases route 
router.post("/code/run-all", runAllTestCases);


module.exports = router;