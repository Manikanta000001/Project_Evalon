const dotenv = require("dotenv");
const connectDB = require("../config/db");

const Admin = require("../models/Admin.model");
const Student = require("../models/Student.model");
const Teacher = require("../models/Teacher.model");

dotenv.config();

const runTest = async () => {
  try {
    await connectDB();

    // 1️⃣ Pick any admin
    const admin = await Admin.findOne();
    if (!admin) {
      console.log("❌ No admin found");
      process.exit(1);
    }

    console.log("✅ Admin found:", admin.email);
    console.log("🏫 College ID:", admin.collegeId.toString());

    // 2️⃣ Fetch students of this college
    const students =   await  Student.find({
  department: "CSE",
  currentBatch: "23",
  section: "B"
});

    // 3️⃣ Fetch teachers of this college
    const teachers = await Teacher.find({
      collegeId: admin.collegeId
    });

    console.log("\n📚 Students in this college:", students.length);
    students.forEach(s =>
      console.log(`- ${s.name} (${s.email}) ${s.department} ${s.currentBatch} ${s.section}`)
    );

    console.log("\n👨‍🏫 Teachers in this college:", teachers.length);
    teachers.forEach(t =>
      console.log(`- ${t.name} (${t.email}) ${t.department}`)
    );

    process.exit(0);
  } catch (err) {
    console.error("❌ Test failed:", err);
    process.exit(1);
  }
};

runTest();
