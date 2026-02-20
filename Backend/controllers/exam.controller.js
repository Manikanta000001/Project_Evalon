const Exam = require("../models/Exam.model");
const Question = require("../models/Question.model");
const Student = require("../models/Student.model");
const Attempt = require("../models/Attempt.model");
const Result = require("../models/Result.model");
const ExcelJS = require("exceljs");
const PDFDocument = require("pdfkit");
const path = require("path");
const fs = require("fs");
/**
 * GET AVAILABLE EXAMS (STUDENT)
 */
const getAvailableExams = async (req, res) => {
  try {
    // 🔒 Role check
    if (req.user.role !== "student") {
      return res.status(403).json({
        message: "Access denied"
      });
    }

    // 👤 Fetch student
    const student = await Student.findById(req.user.id).lean();
    if (!student) {
      return res.status(404).json({
        message: "Student not found"
      });
    }

    // 📘 Fetch ALL exams for student (no time filter)
    const exams = await Exam.find({
        department: student.department,
        year: student.currentBatch,
       $or: [
  { section: student.section },
  { section: { $in: ["ALL"] } }
]

      })
      .populate("createdBy", "name")
      .select("_id title durationMinutes passPercentage startAt endAt createdBy")
      .lean();

    // ⚡ Fetch ONLY attempts related to these exams
    const examIds = exams.map(e => e._id);

    const attempts = await Attempt.find({
        studentId: student._id,
        examId: {
          $in: examIds
        }
      })
      .select("examId status")
      .lean();

    // 🧠 Map attempts for O(1) lookup
    const attemptMap = {};
    for (const a of attempts) {
      attemptMap[a.examId.toString()] = a.status;
    }

    // 📦 Response (UNCHANGED SHAPE)
    const response = exams.map(exam => ({
      examId: exam._id,
      title: exam.title,
      durationMinutes: exam.durationMinutes,
      startAt: exam.startAt,
      endAt: exam.endAt,
      passPercentage: exam.passPercentage,
      conductedBy: exam.createdBy ?.name || "Teacher",
      attemptStatus: attemptMap[exam._id.toString()] || null
    }));

    return res.status(200).json(response);

  } catch (err) {
    console.error("getAvailableExams error:", err);
    return res.status(500).json({
      message: "Failed to fetch exams"
    });
  }
};



/**
 * CREATE EXAM (TEACHER)
 */
const createExam = async (req, res) => {
  try {
    const teacherId = req.user.id;

    const {
      title,
      durationMinutes,
      passPercentage,
      department,
      year,
      section,
      startAt,
      endAt,
      questions,
      codingPerStudent
    } = req.body;


    // 🔒 Basic validation
    if (!title || !durationMinutes || !passPercentage || !questions ?.length) {
      return res.status(400).json({
        message: "Missing required fields"
      });
    }

    // 1️⃣ Create Exam
    const exam = await Exam.create({
      title,
      durationMinutes,
      passPercentage,
      department,
      year,
      section,
      startAt,
      endAt,
      createdBy: teacherId,
      codingPerStudent: codingPerStudent || 0
    });

    // 2️⃣ Attach examId to questions
    const questionDocs = questions.map(q => ({
      ...q,
      examId: exam._id
    }));

    // 3️⃣ Insert questions
    await Question.insertMany(questionDocs);

    return res.status(201).json({
      success: true,
      examId: exam._id
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Exam creation failed"
    });
  }
};


// utility
const shuffle = (array) => {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};


/**
 * START / RESUME EXAM
 */
const startExam = async (req, res) => {
  try {
    const {
      examId
    } = req.body;
    const studentId = req.user.id; // 🔐 always from token

    const exam = await Exam.findById(examId);
    if (!exam) {
      return res.status(404).json({
        message: "Exam not found"
      });
    }

    // 🔒 Time validation
    const now = new Date();
    if (now < exam.startAt || now > exam.endAt) {
      return res.status(403).json({
        message: "Exam not active"
      });
    }

    let attempt = await Attempt.findOne({
      examId,
      studentId
    });

    // ❌ Already submitted
    if (attempt && attempt.status === "submitted") {
      return res.status(403).json({
        message: "Exam already submitted. Reattempt not allowed."
      });
    }

    // 🔁 RESUME ATTEMPT
    if (attempt && attempt.status === "in_progress") {

      // 🛟 Backward compatibility
if (!attempt.questionOrder || attempt.questionOrder.length === 0) {

  const questions = await Question.find({ examId });

  const mcqs = questions.filter(q => q.type === "mcq");
  const coding = questions.filter(q => q.type === "coding");

  const shuffledMCQs = shuffle(mcqs);

  let selectedCoding = [];
  if (exam.codingPerStudent > 0) {
    selectedCoding = shuffle(coding).slice(0, exam.codingPerStudent);
  }

  const finalQuestions = [...shuffledMCQs, ...selectedCoding];

  attempt.questionOrder = finalQuestions.map(q => q._id);
  await attempt.save();
}


      const questions = await Question.find({
        _id: {
          $in: attempt.questionOrder
        }
      });

      const orderedQuestions = attempt.questionOrder.map(id =>
        questions.find(q => q._id.toString() === id.toString())
      );

      return res.json({
        attemptId: attempt._id,
        resume: true,
        startedAt: attempt.startedAt,
        durationMinutes: exam.durationMinutes,
        answers: attempt.answers,
        questions: orderedQuestions.map(q => ({
  questionId: q._id,
  type: q.type,
  text: q.text,

  // MCQ
  options: q.type === "mcq" ? shuffle(q.options) : undefined,

  // Coding
  description: q.type === "coding" ? q.description : undefined,
  inputFormat: q.type === "coding" ? q.inputFormat : undefined,
  outputFormat: q.type === "coding" ? q.outputFormat : undefined,
  marks: q.type === "coding" ? q.marks : undefined,
  difficulty: q.type === "coding" ? q.difficulty : undefined,
  testCases:
  q.type === "coding"
    ? q.testCases
        ?.filter(tc => tc.isHidden === false)
        .map(tc => ({
          input: tc.input,
          expectedOutput: tc.expectedOutput
        }))
    : undefined

}))

      });
    }

    // 🆕 NEW ATTEMPT
    const questions = await Question.find({
      examId
    });

    const mcqs = questions.filter(q => q.type === "mcq");
    const coding = questions.filter(q => q.type === "coding");

    // Shuffle MCQs normally
    const shuffledMCQs = shuffle(mcqs);

    // Select limited coding per student
    let selectedCoding = [];

    if (exam.codingPerStudent > 0) {
      const shuffledCoding = shuffle(coding);
      selectedCoding = shuffledCoding.slice(0, exam.codingPerStudent);
    }

    // ✅ FINAL ORDER: MCQs FIRST, CODING LAST
    const finalQuestions = [
      ...shuffledMCQs,
      ...selectedCoding
    ];


    attempt = await Attempt.create({
      examId,
      studentId,
      startedAt: new Date(),
      status: "in_progress",
      answers: {},
      questionOrder: finalQuestions.map(q => q._id)

    });

    return res.json({
      attemptId: attempt._id,
      resume: false,
      startedAt: attempt.startedAt,
      durationMinutes: exam.durationMinutes,
questions: finalQuestions.map(q => ({
  questionId: q._id,
  type: q.type,
  text: q.text,

  // MCQ
  options: q.type === "mcq" ? shuffle(q.options) : undefined,
  correctOptionIndex: undefined, // never send correct answer

  // Coding
  description: q.type === "coding" ? q.description : undefined,
  inputFormat: q.type === "coding" ? q.inputFormat : undefined,
  outputFormat: q.type === "coding" ? q.outputFormat : undefined,
  marks: q.type === "coding" ? q.marks : undefined,
  difficulty: q.type === "coding" ? q.difficulty : undefined,
testCases:
  q.type === "coding"
    ? q.testCases
        ?.filter(tc => tc.isHidden === false)
        .map(tc => ({
          input: tc.input,
          expectedOutput: tc.expectedOutput
        }))
    : undefined

}))

    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Failed to start exam"
    });
  }
};

// const submitExam = async (req, res) => {
//   try {
//     const {
//       attemptId,
//       answers,
//       codingMarks = {}
//     } = req.body;

//     const attempt = await Attempt.findById(attemptId);
//     if (!attempt || attempt.status === "submitted") {
//       return res.status(400).json({
//         message: "Invalid attempt"
//       });
//     }

//     const exam = await Exam.findById(attempt.examId);
//  const questions = await Question.find({
//   _id: { $in: attempt.questionOrder }
// });

// let mcqScore = 0;
// let totalMCQ = 0;
// let codingScore = 0;
// let totalCodingMarks = 0;

// questions.forEach(q => {

//   if (q.type === "mcq") {
//     totalMCQ++;
//     if (answers[q._id] === q.correctOptionIndex) {
//       mcqScore++;
//     }
//   }

//   if (q.type === "coding") {
//     totalCodingMarks += q.marks || 0;

//     if (codingMarks[q._id]) {
//       codingScore += codingMarks[q._id];
//     }
//   }
// });



//     attempt.answers = answers;
//     attempt.status = "submitted";
//     attempt.submittedAt = new Date();
//     await attempt.save();

//   const percentage = totalMCQ > 0
//   ? Math.round((score / totalMCQ) * 100)
//   : 0;

//     const passed = percentage >= exam.passPercentage;

//  await Result.create({
//   attemptId,
//   examId: attempt.examId,
//   studentId: attempt.studentId,
//   score,
//   total: totalMCQ,
//   percentage,
//   passed
// });


//     res.json({
//       success: true,
//       score,
//       total: totalMCQ,
//       percentage,
//       passed
//     });

//   } catch (err) {
//     console.error(err);
//     res.status(500).json({
//       message: "Submission failed"
//     });
//   }
// };

const submitExam = async (req, res) => {
  try {
    const { attemptId, answers, codingMarks = {} } = req.body;

    const attempt = await Attempt.findById(attemptId);
    if (!attempt || attempt.status === "submitted") {
      return res.status(400).json({
        message: "Invalid attempt",
      });
    }

    const exam = await Exam.findById(attempt.examId);

    const questions = await Question.find({
      _id: { $in: attempt.questionOrder },
    });

    let mcqScore = 0;
    let totalMCQ = 0;

    let codingScore = 0;
    let totalCodingMarks = 0;

    // 🔍 Calculate scores
    questions.forEach((q) => {
      // MCQ scoring
      if (q.type === "mcq") {
        totalMCQ++;
        if (answers[q._id] === q.correctOptionIndex) {
          mcqScore++;
        }
      }

      // Coding scoring
      if (q.type === "coding") {
        totalCodingMarks += q.marks || 0;

        // IMPORTANT: allow 0 marks
        if (codingMarks[q._id] !== undefined) {
          codingScore += codingMarks[q._id];
        }
      }
    });

    // ✅ Final totals
    const totalMarks = totalMCQ + totalCodingMarks;
    const finalScore = mcqScore + codingScore;

    const percentage =
      totalMarks > 0
        ? Math.round((finalScore / totalMarks) * 100)
        : 0;

    const passed = percentage >= exam.passPercentage;

    // 💾 Save attempt
    attempt.answers = answers;
    attempt.status = "submitted";
    attempt.submittedAt = new Date();
    await attempt.save();

    // 💾 Save result
    await Result.create({
      attemptId,
      examId: attempt.examId,
      studentId: attempt.studentId,
      score: finalScore,
      total: totalMarks,
      percentage,
      passed,
    });

    // 📤 Response
    res.json({
      success: true,
      score: finalScore,
      total: totalMarks,
      percentage,
      passed,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Submission failed",
    });
  }
};

const saveAnswer = async (req, res) => {
  try {
    const {
      attemptId,
      questionId,
      answer
    } = req.body;
    console.log("hello")

    if (!attemptId || !questionId) {
      return res.status(400).json({
        message: "Missing data"
      });
    }

    await Attempt.updateOne({
      _id: attemptId,
      status: "in_progress"
    }, {
      $set: {
        [`answers.${questionId}`]: answer
      }
    });

    res.json({
      success: true
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Failed to save answer"
    });
  }
};
const getMyResults = async (req, res) => {
  try {
    // 1. Student ID from auth middleware
    const studentId = req.user.id; // this is correct in your setup

    // 2. Fetch results and populate exam
    const results = await Result.find({
        studentId
      })
      .populate("examId", "title department")
      .sort({
        createdAt: -1
      });

    // 3. Build response safely (handle deleted exams)
    const response = results
      .filter(r => r.examId) // 🔐 remove dangling exam references
      .map(r => ({
        attemptId: r.attemptId,
        examId: r.examId._id,
        exam: r.examId.title,
        subject: r.examId.department,
        score: r.score,
        total: r.total,
        percentage: r.percentage,
        status: r.passed ? "Pass" : "Fail",
        date: r.createdAt.toLocaleDateString(),
        time: r.createdAt.toLocaleTimeString(),
      }));

    // 4. Always return an array
    res.status(200).json(response);

  } catch (err) {
    console.error("getMyResults error:", err);
    res.status(500).json({
      message: "Failed to fetch results"
    });
  }
};


const deleteExam = async (req, res) => {
  const exam = await Exam.findById(req.params.examId);

  if (!exam) return res.status(404).json({
    message: "Exam not found"
  });

  const now = new Date();
  if (now >= exam.startAt) {
    return res.status(400).json({
      message: "Live exams cannot be deleted"
    });
  }

  if (exam.createdBy.toString() !== req.user.id.toString()) {
    return res.status(403).json({
      message: "Unauthorized"
    });
  }

  await exam.deleteOne();
  res.status(200).json({
    message: "Exam deleted"
  });
};

const getExamReport = async (req, res) => {
  try {
    const {
      examId
    } = req.params;
    const format = req.query.format || "pdf";

    console.log("Report format:", format);

    /* -------------------------------------------------
       1. Fetch exam
    -------------------------------------------------- */
    const exam = await Exam.findById(examId).lean();

    if (!exam) {
      return res.status(404).json({
        message: "Exam not found"
      });
    }

    /* -------------------------------------------------
       2. Ownership check
    -------------------------------------------------- */
    if (exam.createdBy.toString() !== req.user.id.toString()) {
      return res.status(403).json({
        message: "Unauthorized"
      });
    }

    /* -------------------------------------------------
       3. Format YEAR (+711 rule)
    -------------------------------------------------- */
    let formattedYear = null;
    if (exam.year) {
      formattedYear = `${exam.year}711`;
    }

    /* -------------------------------------------------
       4. Exam meta (for PDF header)
    -------------------------------------------------- */
    const examMeta = {
      title: exam.title,
      department: exam.department,
      year: formattedYear, // null if not valid
      section: exam.section?.join(", "),
      duration: `${exam.durationMinutes} Minutes`,
      passPercentage: exam.passPercentage,
      generatedOn: new Date()
    };

    /* -------------------------------------------------
       5. Fetch submitted attempts + student info
    -------------------------------------------------- */
    const results = await Result.find({
        examId
      })
      .populate("studentId", "name email rollNumber currentBatch section")
      .lean();






    /* -------------------------------------------------
       6. Build student rows
    -------------------------------------------------- */
const students = results.map((r, index) => {
  return {
    name: r.studentId?.name || "Unknown",
    rollNo: r.studentId?.rollNumber || "N/A",
    year: r.studentId?.currentBatch || "",
    section: r.studentId?.section || "",
    maxMarks: r.score, // 🔥 only obtained marks
    result: r.passed ? "Pass" : "Fail",
    _sortScore: r.score
  };
});



    /* -------------------------------------------------
       7. Sort by score (DESC)
    -------------------------------------------------- */
    students.sort((a, b) => b._sortScore - a._sortScore);
    students.forEach(s => delete s._sortScore);

    /* -------------------------------------------------
       8. TEMP response (JSON only)
       (PDF / Excel generation comes next)
    -------------------------------------------------- */
    if (format === "excel") {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Exam Report");
worksheet.columns = [
  { header: "S.No", key: "sno", width: 8 },
  { header: "Name", key: "name", width: 25 },
  { header: "Roll No", key: "rollNo", width: 18 },
  { header: "Year", key: "year", width: 12 },
  { header: "Section", key: "section", width: 10 },
  { header: "Max Marks", key: "maxMarks", width: 12 },
  { header: "Result", key: "result", width: 12 }
];


      // ✅ Add rows
if (students.length === 0) {
  worksheet.addRow({
    sno: "",
    name: "No submissions",
    rollNo: "",
    year: "",
    section: "",
    maxMarks: "",
    result: ""
  });
}
 else {
        console.log(students)
students.forEach((student, index) => {
  worksheet.addRow({
    sno: index + 1,
    name: student.name,
    rollNo: student.rollNo,
    year: student.year,
    section: student.section,
    maxMarks: student.maxMarks,
    result: student.result
  });
});

      }



      // We will add headers and rows next

      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${examMeta.title}-report.xlsx"`
      );

      await workbook.xlsx.write(res);
      return res.end();
    }

//     if (format === "pdf") {
//       const bannerPath = path.join(__dirname, "../assets/necnbanner.png");
//       console.log("Banner exists:", fs.existsSync(bannerPath), bannerPath);

//       const doc = new PDFDocument({
//         margin: 40,
//         size: "A4",
//       });

//       res.setHeader("Content-Type", "application/pdf");
//       res.setHeader(
//         "Content-Disposition",
//         `attachment; filename="${examMeta.title}-report.pdf"`
//       );

//       const drawBanner = () => {
//         const bannerHeight = 70; // adjust if needed
//         const bannerWidth = 500;

//         const x = (doc.page.width - bannerWidth) / 2;
//         const y = 20;

//         if (fs.existsSync(bannerPath)) {
//           doc.image(bannerPath, x, y, {
//             width: bannerWidth
//           });
//         }

//         // Move cursor below banner
//         doc.y = y + bannerHeight + 20;
//       };
//       doc.pipe(res);
//       drawBanner();

//       // -------- Title --------
//       doc
//         .fontSize(18)
//         .text("ASSIGNMENT REPORT", {
//           align: "center"
//         })
//         .moveDown();

//       // -------- Exam Meta --------
//       doc.fontSize(11);
//       doc.text(`Title: ${examMeta.title}`);
//       doc.text(`Department: ${examMeta.department}`);
//       if (examMeta.year) doc.text(`Year: ${examMeta.year}`);
//       doc.text(`Section: ${examMeta.section}`);
//       doc.text(`Duration: ${examMeta.duration}`);
//       doc.text(`Pass Percentage: ${examMeta.passPercentage}%`);
//       doc.text(`Generated On: ${new Date(examMeta.generatedOn).toLocaleString()}`);
//       doc.moveDown(1.5);
//       doc.save();
// doc.rotate(90, {
//   origin: [doc.page.width / 2, doc.page.height / 2]
// });

//       // ---------- TABLE START POSITION ----------
//       const tableTop = doc.y + 10;
//       const rowHeight = 24;
//       const cellPadding = 8;

//       // Colors
//       const headerBg = "#2563EB"; // Tailwind blue-600
//       const borderColor = "#000000"; // slate-200

//       // Table boundaries
// const tableLeft = -doc.page.height + 80; 
// const tableWidth = doc.page.height - 120;

//       const tableRight = tableLeft + tableWidth;
//       const pageBottom = doc.page.height - 60;
// const drawTableHeader = (yPos) => {
//   doc
//     .fillColor(headerBg)
//     .rect(tableLeft, yPos, tableWidth, rowHeight)
//     .fill();

//   doc
//     .fillColor("white")
//     .font("Helvetica-Bold")
//     .fontSize(10);

//   doc.text("S.No", col.sno + cellPadding, yPos + 7);
//   doc.text("Name", col.name + cellPadding, yPos + 7);
//   doc.text("Roll No", col.rollNo + cellPadding, yPos + 7);
//   doc.text("Year", col.year + cellPadding, yPos + 7);
//   doc.text("Section", col.section + cellPadding, yPos + 7);
//   doc.text("Max Marks", col.maxMarks + cellPadding, yPos + 7);
//   doc.text("Result", col.result + cellPadding, yPos + 7);

//   doc
//     .strokeColor(borderColor)
//     .rect(tableLeft, yPos, tableWidth, rowHeight)
//     .stroke();

//   doc.fillColor("black").font("Helvetica");
// };



//       // Column X positions
//       // const col = {
//       //   name: 40,
//       //   email: 160,
//       //   score: 330,
//       //   percentage: 410,
//       //   result: 490
//       // };
// const col = {
//   sno: 40,
//   name: 90,
//   rollNo: 250,
//   year: 380,
//   section: 450,
//   maxMarks: 520,
//   result: 610
// };



//       // ---------- HEADER BACKGROUND ----------
//       drawTableHeader(tableTop);




//       // Header bottom border
//       doc
//         .strokeColor(borderColor)
//         .moveTo(tableLeft, tableTop + rowHeight)
//         .lineTo(tableRight, tableTop + rowHeight)
//         .stroke();

//       // Reset styles
//       doc.fillColor("black").font("Helvetica");

//       // Cursor for rows
//       let y = tableTop + rowHeight;

//       // ---------- TABLE ROWS ----------
//       if (students.length === 0) {
//         doc.text("No students attempted this exam.", tableLeft, y + 8);
//       } else {
//         students.forEach((s, index) => {
//           // 🔥 PAGE BREAK CHECK
//           if (y + rowHeight > pageBottom) {
//             doc.addPage();
//             drawBanner();
//             y = doc.y + 10;
//             drawTableHeader(y);
//             y += rowHeight;

//           }

//           // Zebra row
//           if (index % 2 === 1) {
//             doc
//               .fillColor("#F1F5F9")
//               .rect(tableLeft, y, tableWidth, rowHeight)
//               .fill();
//           }

//           // Cell border
//           doc
//             .strokeColor(borderColor)
//             .rect(tableLeft, y, tableWidth, rowHeight)
//             .stroke();

//           // Cell text
//           doc.fillColor("black").fontSize(10);
//          doc.text(index + 1, col.sno + cellPadding, y + 7);
// doc.text(s.name, col.name + cellPadding, y + 7);
// doc.text(s.rollNo, col.rollNo + cellPadding, y + 7);
// doc.text(s.year, col.year + cellPadding, y + 7);
// doc.text(s.section, col.section + cellPadding, y + 7);
// doc.text(s.maxMarks.toString(), col.maxMarks + cellPadding, y + 7);
// doc.text(s.result, col.result + cellPadding, y + 7);


//           y += rowHeight;
//         });

//       }

//       // ---------- OUTER TABLE BORDER ----------
//       doc
//         .strokeColor(borderColor)
//         .rect(tableLeft, tableTop, tableWidth, y - tableTop)
//         .stroke();

//       // ---------- VERTICAL COLUMN BORDERS ----------
// [
//   col.name,
//   col.rollNo,
//   col.year,
//   col.section,
//   col.maxMarks,
//   col.result
// ]
// .forEach((x) => {
//         doc
//           .moveTo(x - 10, tableTop)
//           .lineTo(x - 10, y)
//           .stroke();
//       });

// doc.restore(); // 🔁 restore normal orientation

//       doc.end();
//       return;
//     }
if (format === "pdf") {
  const bannerPath = path.join(__dirname, "../assets/necnbanner.png");

  const doc = new PDFDocument({
    margin: 0,
    size: "A4"
  });

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename="${examMeta.title}-report.pdf"`
  );

  doc.pipe(res);

  /* =========================
      ROTATE FULL PAGE
  ========================= */

  doc.save();
  doc.rotate(90);
  doc.translate(0, -doc.page.width);

  const pageWidth = doc.page.height;
  const pageHeightLimit = doc.page.width - 40;

  let currentY = 40;

  /* =========================
      BANNER (ONLY FIRST PAGE)
  ========================= */

  const bannerWidth = pageWidth * 0.55;
  const bannerX = (pageWidth - bannerWidth) / 2;

  if (fs.existsSync(bannerPath)) {
    doc.image(bannerPath, bannerX, currentY, {
      width: bannerWidth
    });
  }

  currentY += 100; // space below banner

/* =========================
    EXAM META (FIRST PAGE ONLY)
========================= */

doc
  .fillColor("black")
  .font("Helvetica")
  .fontSize(11);

doc.text(`Examination Title: ${examMeta.title}`, 60, currentY);
currentY += 18;

doc.text(`Section: ${examMeta.section}`, 60, currentY);
currentY += 18;

doc.text(`Duration: ${examMeta.duration}`, 60, currentY);
currentY += 18;

doc.text(`Pass Percentage: ${examMeta.passPercentage}%`, 60, currentY);
currentY += 18;

doc.text(
  `Generated On: ${new Date(examMeta.generatedOn).toLocaleString()}`,
  60,
  currentY
);

currentY += 30; // 🔥 spacing before table


  /* =========================
      TABLE CONFIG
  ========================= */

  const rowHeight = 32;
  const tableLeft = 40;
  const tableWidth = pageWidth - 80;

  const col = {
    sno: tableLeft,
    name: tableLeft + 80,
    rollNo: tableLeft + 260,
    year: tableLeft + 400,
    section: tableLeft + 470,
    maxMarks: tableLeft + 550,
    result: tableLeft + 650
  };

  const drawHeader = () => {
    doc
      .fillColor("#2563EB")
      .rect(tableLeft, currentY, tableWidth, rowHeight)
      .fill();

    doc.fillColor("white")
       .font("Helvetica-Bold")
       .fontSize(11);

    doc.text("S.No", col.sno + 10, currentY + 10);
    doc.text("Name", col.name + 10, currentY + 10);
    doc.text("Roll No", col.rollNo + 10, currentY + 10);
    doc.text("Year", col.year + 10, currentY + 10);
    doc.text("Section", col.section + 10, currentY + 10);
    doc.text("Max Marks", col.maxMarks + 10, currentY + 10);
    doc.text("Result", col.result + 10, currentY + 10);

    doc.rect(tableLeft, currentY, tableWidth, rowHeight).stroke();

    currentY += rowHeight;
    doc.fillColor("black").font("Helvetica");
  };

  const drawVerticalLines = (startY, endY) => {
    [
      col.name,
      col.rollNo,
      col.year,
      col.section,
      col.maxMarks,
      col.result
    ].forEach((x) => {
      doc.moveTo(x, startY).lineTo(x, endY).stroke();
    });

    doc.moveTo(tableLeft, startY).lineTo(tableLeft, endY).stroke();
    doc.moveTo(tableLeft + tableWidth, startY)
       .lineTo(tableLeft + tableWidth, endY)
       .stroke();
  };

  /* =========================
      INITIAL HEADER
  ========================= */

  let tableStartY = currentY;
  drawHeader();

  /* =========================
      ROWS WITH PAGE BREAK
  ========================= */

  students.forEach((s, index) => {

    if (currentY + rowHeight > pageHeightLimit) {

      // close previous page borders
      drawVerticalLines(tableStartY, currentY);

      doc.addPage();

      // re-apply rotation
      doc.save();
      doc.rotate(90);
      doc.translate(0, -doc.page.width);

      currentY = 40;
      tableStartY = currentY;

      drawHeader();
    }

    // zebra rows
    if (index % 2 === 1) {
      doc.fillColor("#F1F5F9")
         .rect(tableLeft, currentY, tableWidth, rowHeight)
         .fill();
      doc.fillColor("black");
    }

    doc.rect(tableLeft, currentY, tableWidth, rowHeight).stroke();

    doc.text(index + 1, col.sno + 10, currentY + 10);
    doc.text(s.name, col.name + 10, currentY + 10);
    doc.text(s.rollNo, col.rollNo + 10, currentY + 10);
    doc.text(String(s.year), col.year + 10, currentY + 10);
    doc.text(s.section, col.section + 10, currentY + 10);
    doc.text(String(s.maxMarks), col.maxMarks + 10, currentY + 10);
    doc.text(s.result, col.result + 10, currentY + 10);

    currentY += rowHeight;
  });

  // close last page borders
  drawVerticalLines(tableStartY, currentY);

  doc.restore();
  doc.end();
  return;
}




  } catch (error) {
    console.error("getExamReport error:", error);
    res.status(500).json({
      message: "Failed to generate exam report"
    });
  }
};


module.exports = {
  getAvailableExams,
  createExam,
  startExam,
  submitExam,
  saveAnswer,
  getMyResults,
  deleteExam,
  getExamReport
};