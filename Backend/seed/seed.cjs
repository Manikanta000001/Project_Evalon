const dotenv = require("dotenv");
const connectDB = require("../config/db");
const bcrypt = require("bcryptjs");


const College = require("../models/College.model");
const Admin = require("../models/Admin.model");
const Teacher = require("../models/Teacher.model");
const Student = require("../models/Student.model");

const {
  colleges,
  admins,
  teachers,
  students
} = require("./mockData");


dotenv.config();

const seedData = async () => {
  try {
    // Clear existing data
    await connectDB();
    await College.deleteMany();
    await Admin.deleteMany();
    await Teacher.deleteMany();
    await Student.deleteMany();

    console.log("Old data removed");

    // Insert college
    const createdColleges = await College.insertMany(colleges);
    const collegeId = createdColleges[0]._id;

    // Insert admin
  await Admin.insertMany(
  admins.map(admin => ({
    ...admin,
    password: bcrypt.hashSync(admin.password, 10),
    collegeId
  }))
);


    // Insert teachers
 await Teacher.insertMany(
  teachers.map(teacher => ({
    ...teacher,
    password: bcrypt.hashSync(teacher.password, 10),
    collegeId
  }))
);


    // Insert students
await Student.insertMany(
  students.map(student => ({
    ...student,
    password: bcrypt.hashSync(student.password, 10),
    collegeId
  }))
);


    console.log("Mock data seeded successfully");
    process.exit();
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
};

seedData();
