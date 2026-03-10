const express = require("express");
const {getTeacherDashboard,getStudentDashboard,getHodDashboard,getExamCellDashboard} =require("../controllers/Dashboards.controller")
const {protect }=require("../middleware/authMiddleware")

const router = express.Router();
console.log("hi")

// testcases route 
router.get("/teacher",protect,getTeacherDashboard);
router.get("/student",protect,getStudentDashboard);
router.get("/hod",protect,getHodDashboard);
router.get("/examcell",protect,getExamCellDashboard);


module.exports = router;