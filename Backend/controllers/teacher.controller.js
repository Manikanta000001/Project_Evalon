const Exam = require("../models/Exam.model");
const Student = require("../models/Student.model");
const Attempt = require("../models/Attempt.model");

const getTeacherExams = async (req, res) => {
  try {
    const teacherId = req.user.id;
const exams = await Exam.find({ createdBy: teacherId })
  .sort({ createdAt: -1 })
  .lean();


    const result = await Promise.all(
      exams.map(async (exam) => {

        // 1️⃣ Eligible students (CORRECT FIELDS)
        const totalStudents = await Student.countDocuments({
  department: exam.department,
  section: exam.section,
  currentBatch: exam.year
});

        // 2️⃣ Submitted attempts
      const submitted = await Attempt.countDocuments({
  examId: exam._id,
  status: "submitted"
});
        // 3️⃣ Submission rate
        const submissionRate =
          totalStudents === 0
            ? 0
            : Math.round((submitted / totalStudents) * 100);

        return {
          _id: exam._id,
          title: exam.title,
          startAt: exam.startAt,
          endAt: exam.endAt,
          students: totalStudents,
          submissionRate
        };
      })
    );

    res.status(200).json(result);
  } catch (err) {
    console.error("getTeacherExams error:", err);
    res.status(500).json({ message: "Failed to fetch exams" });
  }
};

module.exports = { getTeacherExams };
