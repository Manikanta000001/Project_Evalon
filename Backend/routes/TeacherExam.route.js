const express = require("express");

const {
    getTeacherExams
} = require("../controllers/teacher.controller");
const { protect,isTeacher } = require("../middleware/authMiddleware");
const router = express.Router();
router.get("/exams", protect,isTeacher,getTeacherExams);


module.exports = router;