const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
// Resolve the .env path correctly based on the script's directory
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") }); 

const Student = require("../models/Student.model");

const addStudents = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");

    const students = [];
    // The password is "student123" for every student, properly hashed.
    const passwordHash = bcrypt.hashSync("student123", 10);
    const collegeId = "699b14c29af44c0c1ed313df";
    
    // 1. Generate CSE Students (160 students)
    // Using formatting like 23711, 23712 (batch 23, dept 1 for CSE)
    for (let i = 1; i <= 160; i++) {
      students.push({
        name: `CSE Student ${i}`,
        email: `cse23_${i}@abc.edu`,
        password: passwordHash,
        rollNumber: `2371${i}`, 
        admissionBatch: "23",
        currentBatch: "23",
        collegeId: collegeId,
        department: "CSE",
        section: i <= 60 ? "A" : (i <= 120 ? "B" : "C"),
        role: "student",
        isActive: true
      });
    }

    // 2. Generate ECE Students (40 students)
    // Using formatting like 23721, 23722 (batch 23, dept 2 for ECE)
    for (let i = 1; i <= 40; i++) {
      students.push({
        name: `ECE Student ${i}`,
        email: `ece23_${i}@abc.edu`,
        password: passwordHash,
        rollNumber: `2372${i}`,
        admissionBatch: "23",
        currentBatch: "23",
        collegeId: collegeId,
        department: "ECE",
        section: i <= 20 ? "A" : "B",
        role: "student",
        isActive: true
      });
    }

    // 3. Generate MECH Students (20 students)
    // Using formatting like 23741, 23742 (batch 23, dept 4 for MECH)
    for (let i = 1; i <= 20; i++) {
      students.push({
        name: `MECH Student ${i}`,
        email: `mech23_${i}@abc.edu`,
        password: passwordHash,
        rollNumber: `2374${i}`,
        admissionBatch: "23",
        currentBatch: "23",
        collegeId: collegeId,
        department: "MECH",
        section: "A",
        role: "student",
        isActive: true
      });
    }

    // Insert to DB and handle duplicates gracefully
    try {
      const result = await Student.insertMany(students, { ordered: false });
      console.log(`Successfully added ${result.length} student records.`);
    } catch (err) {
      if (err.code === 11000) {
        // Some records were duplicates
        console.log(`Inserted ${err.insertedDocs ? err.insertedDocs.length : 'some'} students. Duplicate entries were skipped.`);
      } else {
        throw err;
      }
    }

    process.exit(0);
  } catch (error) {
    console.error("Error adding students:", error);
    process.exit(1);
  }
};

addStudents();
