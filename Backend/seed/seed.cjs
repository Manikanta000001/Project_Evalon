// const dotenv = require("dotenv");
// const connectDB = require("../config/db");
// const bcrypt = require("bcryptjs");


// const College = require("../models/College.model");
// const Admin = require("../models/Admin.model");
// const Teacher = require("../models/Teacher.model");
// const Student = require("../models/Student.model");

// const {
//   colleges,
//   admins,
//   teachers,
//   students
// } = require("./mockData");


// dotenv.config();

// const seedData = async () => {
//   try {
//     // Clear existing data
//     await connectDB();
//     await College.deleteMany();
//     await Admin.deleteMany();
//     await Teacher.deleteMany();
//     await Student.deleteMany();

//     console.log("Old data removed");

//     // Insert college
//     const createdColleges = await College.insertMany(colleges);
//     const collegeId = createdColleges[0]._id;

//     // Insert admin
//   await Admin.insertMany(
//   admins.map(admin => ({
//     ...admin,
//     password: bcrypt.hashSync(admin.password, 10),
//     collegeId
//   }))
// );


//     // Insert teachers
//  await Teacher.insertMany(
//   teachers.map(teacher => ({
//     ...teacher,
//     password: bcrypt.hashSync(teacher.password, 10),
//     collegeId
//   }))
// );


//     // Insert students
// await Student.insertMany(
//   students.map(student => ({
//     ...student,
//     password: bcrypt.hashSync(student.password, 10),
//     collegeId
//   }))
// );


//     console.log("Mock data seeded successfully");
//     process.exit();
//   } catch (error) {
//     console.error("Seeding failed:", error);
//     process.exit(1);
//   }
// };

// seedData();
const mongoose = require("mongoose");
require("dotenv").config();

const Student = require("../models/Student.model");
const Exam = require("../models/Exam.model");
const Attempt = require("../models/Attempt.model");
const Result = require("../models/Result.model");

async function seedResults() {
  try {

    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");

    const students = await Student.find();
    const exams = await Exam.find();

    if (!students.length || !exams.length) {
      console.log("No students or exams found.");
      process.exit();
    }

    const attempts = [];
    const results = [];

    for (let i = 0; i < 120; i++) {

      const student = students[Math.floor(Math.random() * students.length)];
      const exam = exams[Math.floor(Math.random() * exams.length)];

      const start = new Date();
      start.setDate(start.getDate() - Math.floor(Math.random() * 30));

      const submit = new Date(start);
      submit.setMinutes(submit.getMinutes() + 45);

      const attempt = new Attempt({
        examId: exam._id,
        studentId: student._id,
        status: "submitted",
        startedAt: start,
        submittedAt: submit
      });

      attempts.push(attempt);
    }

    const insertedAttempts = await Attempt.insertMany(attempts);

    for (const attempt of insertedAttempts) {

      const exam = exams.find(e => e._id.equals(attempt.examId));

      const totalMarks = 100;

      // generate score
      const score = Math.floor(Math.random() * 100);

      const percentage = (score / totalMarks) * 100;

      const passed = percentage >= exam.passPercentage;

      results.push({
        attemptId: attempt._id,
        examId: attempt.examId,
        studentId: attempt.studentId,
        score,
        total: totalMarks,
        percentage,
        passed
      });
    }

    await Result.insertMany(results);

    console.log("Seeded Attempts:", insertedAttempts.length);
    console.log("Seeded Results:", results.length);

    process.exit();

  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seedResults();