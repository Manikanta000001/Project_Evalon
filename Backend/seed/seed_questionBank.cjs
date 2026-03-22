const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });

const QuestionBank = require("../models/QuestionBank.model");

const seedQuestionBanks = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");

    await QuestionBank.deleteMany({});
    console.log("Cleared existing QuestionBank records");

    const records = [];

    const fileUrl = "https://res.cloudinary.com/dbzbpljkq/raw/upload/v1772008287/evalon/question-banks/evalon/question-banks/1772008287402-ch.docx";
    const cloudinaryId = "evalon/question-banks/evalon/question-banks/1772008287402-ch.docx";
    
    const fileUrlAlt = "https://res.cloudinary.com/dbzbpljkq/raw/upload/v1772008488/evalon/question-banks/evalon/question-banks/1772008487168-mad.docx";
    const cloudinaryIdAlt = "evalon/question-banks/evalon/question-banks/1772008487168-mad.docx";
    const department = "CSE";

    const subjects = [
      "Android Development",
      "Data Structures",
      "Computer Networks",
      "Database Management Systems",
      "Software Engineering",
      "Operating Systems",
      "Cloud Computing",
      "Machine Learning",
      "Artificial Intelligence",
      "Compiler Design"
    ];

    const titles = [
      "Mid-Term Questions Model",
      "End Semester Question Bank",
      "Unit 1 Question Set",
      "Important Theory Questions",
      "Lab Practical Questions",
      "Previous Year Questions",
      "Assignment Questions Set",
      "Unit 2 and 3 Revision Questions",
      "Model Paper - Set A",
      "Model Paper - Set B"
    ];

    const generateRemarks = (status) => {
      const date = new Date();
      if (status === "SUBMITTED") {
        return [{ role: "teacher", comment: "Uploaded successfully for review. Please check.", date }];
      } else if (status === "HOD_APPROVED") {
        return [{ role: "hod", comment: "Looks good. Approved for the exam.", date }];
      } else if (status === "HOD_REJECTED") {
        return [{ role: "hod", comment: "Please revise Unit 2 questions, they are too simple.", date }];
      } else if (status === "PAPER_GENERATED") {
        return [
          { role: "hod", comment: "Approved.", date: new Date(date.getTime() - 86400000) },
          { role: "admin", comment: "Paper generated from this bank successfully.", date }
        ];
      }
      return [{ role: "system", comment: "Auto-generated remark.", date }];
    };

    const getRandomElement = (arr) => arr[Math.floor(Math.random() * arr.length)];

    for (let i = 0; i < 60; i++) {
        let status;
        if (i < 30) status = "SUBMITTED"; // 30 records SUBMITTED
        else if (i < 50) status = "HOD_APPROVED"; // 20 records HOD_APPROVED
        else status = "HOD_REJECTED"; // 10 records HOD_REJECTED

        let uploadedBy;
        if (i < 40) {
            uploadedBy = "699b14c29af44c0c1ed313e7"; // 40 records
        } else if (i < 50) {
            uploadedBy = "699b14c29af44c0c1ed313e6"; // 10 records
        } else {
            uploadedBy = "699b14c29af44c0c1ed313e5"; // 10 records
        }

        const approvedBy = (status === "HOD_APPROVED" || status === "PAPER_GENERATED") ? "699b14c29af44c0c1ed313e4" : undefined;
        const approvedAt = approvedBy ? new Date() : undefined;

        records.push({
            title: getRandomElement(titles) + " - " + (i + 1),
            subject: getRandomElement(subjects),
            department: department,
            year: Math.random() > 0.5 ? "1st Year" : "2nd Year",
            fileUrl: i < 35 ? fileUrlAlt : fileUrl,
            cloudinaryId: i < 35 ? cloudinaryIdAlt : cloudinaryId,
            uploadedBy: mongoose.Types.ObjectId.createFromHexString(uploadedBy),
            status: status,
            usedForPaper: false,
            approvedBy: approvedBy ? mongoose.Types.ObjectId.createFromHexString(approvedBy) : undefined,
            approvedAt: approvedAt,
            remarks: generateRemarks(status)
        });
    }

    try {
      const result = await QuestionBank.insertMany(records);
      console.log(`Successfully added ${result.length} question bank records.`);
      
      const counts = await QuestionBank.aggregate([
          { $group: { _id: "$status", count: { $sum: 1 } } }
      ]);
      console.log("Status distribution directly from DB:", counts);
      
    } catch (err) {
      console.error("Error inserting question bank records", err);
    }

    process.exit(0);
  } catch (error) {
    console.error("Error connecting to database:", error);
    process.exit(1);
  }
};

seedQuestionBanks();
