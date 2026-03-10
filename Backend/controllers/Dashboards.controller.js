
const Result = require("../models/Result.model");
const Exam = require("../models/Exam.model");
const User = require("../models/Student.model");
const Attempt = require("../models/Attempt.model");
const QuestionBank = require("../models/QuestionBank.model");
const Paper = require("../models/Paper");


exports.getTeacherDashboard = async (req, res) => {
  try {

    const totalStudents = await User.countDocuments();

    const examsCompleted = await Exam.countDocuments({
      createdBy: req.user.id,
      
    });

    // ✅ get results instead of attempts
    const results = await Result.find().sort({ createdAt: 1 });

    if (!results.length) {
      return res.json({
        totalStudents,
        examsCompleted,
        avgScore: 0,
        successRate: 0,
        performanceData: [],
        gradeDistribution: []
      });
    }

    // ---------- Average Score ----------
    const avgScore =
      results.reduce((sum, r) => sum + r.score, 0) / results.length;

    // ---------- Success Rate ----------
    const successRate =
      (results.filter(r => r.passed).length / results.length) * 100;

    // ---------- Performance Chart ----------
    const weekMap = {};

    results.forEach(r => {

      const date = new Date(r.createdAt);

      const week = `${date.getFullYear()}-${Math.ceil(date.getDate() / 7)}`;

      if (!weekMap[week]) {
        weekMap[week] = { passedCount: 0, count: 0 };
      }

      if (r.passed) weekMap[week].passedCount++;
      weekMap[week].count++;

    });

    const performanceData = Object.keys(weekMap).map((week, i) => {

      const passedCount = weekMap[week].passedCount;
      const count = weekMap[week].count;

      const passPercentage = count === 0 ? 0 : (passedCount / count) * 100;

      return {
        name: `Week ${i + 1}`,
        average: Math.round(passPercentage),
        participation: count
      };

    });

    // ---------- Grade Distribution ----------
    const grades = { A:0, B:0, C:0, D:0, F:0 };

    results.forEach(r => {

      const score = r.score;

      if (score >= 85) grades.A++;
      else if (score >= 70) grades.B++;
      else if (score >= 55) grades.C++;
      else if (score >= 40) grades.D++;
      else grades.F++;

    });

    const total = results.length;

    const gradeDistribution = [
      { name:"A", value: Math.round((grades.A/total)*100) },
      { name:"B", value: Math.round((grades.B/total)*100) },
      { name:"C", value: Math.round((grades.C/total)*100) },
      { name:"D", value: Math.round((grades.D/total)*100) },
      { name:"F", value: Math.round((grades.F/total)*100) }
    ];

    const now = new Date();

const assessmentsCreated = await Exam.countDocuments({
  createdBy: req.user.id
});

const activeExams = await Exam.countDocuments({
  createdBy: req.user.id,
  startAt: { $lte: now },
  endAt: { $gte: now }
});

const completedExams = await Exam.countDocuments({
  createdBy: req.user.id,
  endAt: { $lt: now }
});

    res.json({
      totalStudents,
      examsCompleted,
      avgScore: Math.round(avgScore),
      successRate: Math.round(successRate),
      performanceData,
      gradeDistribution,
      assessmentStats: {
  created: assessmentsCreated,
  active: activeExams,
  completed: completedExams
}
      
    });

  } catch (err) {
    console.error("Teacher Dashboard Error:", err);
    res.status(500).json({ message: "Dashboard error" });
  }
};




exports.getStudentDashboard = async (req, res) => {
  try {
    const studentId = req.user.id;
    const now = new Date();

    // =============================
    // 1️⃣ Upcoming Exams
    // =============================
    const upcomingExams = await Exam.find({
      startAt: { $gt: now }
    }).sort({ startAt: 1 });

    const upcomingCount = upcomingExams.length;
    const nextExam = upcomingExams[0] || null;

    // =============================
    // 2️⃣ Results (scores)
    // =============================
    const results = await Result.find({
      studentId
    })
      .populate("examId", "title")
      .sort({ createdAt: -1 });

    const completedCount = results.length;

    // =============================
    // 3️⃣ Average Score
    // =============================
    let avgScore = 0;

    if (completedCount > 0) {
      const totalScore = results.reduce(
        (sum, r) => sum + (r.percentage || 0),
        0
      );

      avgScore = Math.round(totalScore / completedCount);
    }

    // =============================
    // 4️⃣ Recent Activity
    // =============================
    const recentActivity = results.slice(0, 5).map((r) => ({
      title: r.examId?.title,
      score: r.score,
      total: r.total,
      status: "Completed",
      date: r.createdAt
    }));

    // =============================
    // 5️⃣ Attempts
    // =============================
    const attempts = await Attempt.countDocuments({
      studentId
    });

    // =============================
    // Response
    // =============================
    res.json({
      stats: {
        upcoming: upcomingCount,
        completed: completedCount,
        avgScore,
        attempts
      },

      nextExam: nextExam
        ? {
          title: nextExam.title,
          startAt: nextExam.startAt,
          duration: nextExam.duration
        }
        : null,

      recentActivity
    });

  } catch (error) {
    console.error("Student dashboard error:", error);
    res.status(500).json({ message: "Failed to load dashboard" });
  }
};

exports.getHodDashboard = async (req, res) => {
  try {

    const questionBanks = await QuestionBank.find()
      .populate("uploadedBy", "name")
      .sort({ createdAt: -1 })   // newest first
      .limit(10);                // only 10 documents

    const stats = {
      total: questionBanks.length,
      pending: questionBanks.filter(q => q.status === "SUBMITTED").length,
      approved: questionBanks.filter(q => q.status === "HOD_APPROVED").length,
      rejected: questionBanks.filter(q => q.status === "HOD_REJECTED").length
    };

    res.json({
      stats,
      questionBanks
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to load HOD dashboard" });
  }
};

exports.getExamCellDashboard = async (req, res) => {
  try {

    // ===============================
    // QuestionBank Status Counts
    // ===============================
    const totalSubmissions = await QuestionBank.countDocuments();

    const pendingWithHOD = await QuestionBank.countDocuments({
      status: "SUBMITTED"
    });

    const approvedByHOD = await QuestionBank.countDocuments({
      status: "HOD_APPROVED"
    });

    const rejectedByHOD = await QuestionBank.countDocuments({
      status: "HOD_REJECTED"
    });


    // ===============================
    // Paper Stats
    // ===============================
    const papersGenerated = await Paper.countDocuments();


    // ===============================
    // Department Wise Papers
    // ===============================
    const departmentStats = await Paper.aggregate([
      {
        $group: {
          _id: "$meta.department",
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);


    // ===============================
    // Status Distribution (QuestionBank)
    // ===============================
    const totalStatus =
      pendingWithHOD + approvedByHOD + rejectedByHOD;

    const approvedPercentage =
      totalStatus > 0
        ? Math.round((approvedByHOD / totalStatus) * 100)
        : 0;


    // ===============================
    // Response
    // ===============================
    res.json({
      stats: {
        totalSubmissions,
        pendingWithHOD,
        approvedByHOD,
        rejectedByHOD,
        papersGenerated
      },

      departmentStats,

      statusDistribution: {
        submitted: pendingWithHOD,
        approved: approvedByHOD,
        rejected: rejectedByHOD,
        percentage: approvedPercentage
      }
    });

  } catch (error) {
    console.error("ExamCell Dashboard Error:", error);
    res.status(500).json({ message: "Failed to load dashboard" });
  }
};