const cloudinary = require("../config/cloudinary");
const QuestionBank = require("../models/QuestionBank.model");

exports.uploadQuestionBank = async (req, res) => {
    
  try {

    
    const { title, subject, department, year } = req.body;

    if (!title || !subject || !department || !year) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "Word Document file is required" });
    }

    // Upload to Cloudinary
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: "auto",
         public_id: `evalon/question-banks/${Date.now()}-${req.file.originalname}`,
use_filename: true,
unique_filename: true, 
access_mode: "public",// IMPORTANT for PDFs
        folder: "evalon/question-banks"
      },
      async (error, result) => {
        if (error) {
          console.error(error);
          return res.status(500).json({ message: "Cloudinary upload failed" });
        }

        // Save in DB
        const newQB = await QuestionBank.create({
          title,
          subject,
          department,
          year,
          fileUrl: result.secure_url,
          cloudinaryId: result.public_id,
          uploadedBy: req.user.id,
          status: "SUBMITTED"
        });

        res.status(201).json({
          message: "Question bank uploaded successfully",
          data: newQB
        });
      }
    );

    uploadStream.end(req.file.buffer);

  } catch (err) {
    console.error("Upload QB Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getPendingForHOD = async (req, res) => {
  try {
    console.log("requested ")
    const teacher = await require("../models/Teacher.model").findById(req.user.id);

    if (!teacher) {
      return res.status(404).json({ message: "User not found" });
    }

    const pendingQBs = await QuestionBank.find({
      department: teacher.department,
      
    }).populate("uploadedBy", "name email");

    res.json(pendingQBs);

  } catch (err) {
    console.error("HOD Fetch Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.approveByHOD = async (req, res) => {
  try {
    const qb = await QuestionBank.findById(req.params.id);

    if (!qb) {
      return res.status(404).json({ message: "Question bank not found" });
    }

    const teacher = await require("../models/Teacher.model").findById(req.user.id);

    // Department check
    if (qb.department !== teacher.department) {
      return res.status(403).json({ message: "Not allowed for this department" });
    }

    if (qb.status !== "SUBMITTED") {
      return res.status(400).json({ message: "Invalid state" });
    }

    qb.status = "HOD_APPROVED";
qb.approvedBy = req.user.id;
qb.approvedAt = new Date();
    qb.remarks.push({
      role: "hod",
      comment: req.body.comment || "Approved",
      date: new Date()
    });

    await qb.save();

    res.json({ message: "Approved successfully" });

  } catch (err) {
    console.error("HOD Approve Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};


exports.rejectByHOD = async (req, res) => {
  try {
    const qb = await QuestionBank.findById(req.params.id);

    if (!qb) {
      return res.status(404).json({ message: "Question bank not found" });
    }

    const teacher = await require("../models/Teacher.model").findById(req.user.id);

    if (qb.department !== teacher.department) {
      return res.status(403).json({ message: "Not allowed for this department" });
    }

    qb.status = "HOD_REJECTED";

    qb.remarks.push({
      role: "hod",
      comment: req.body.comment || "Rejected",
      date: new Date()
    });

    await qb.save();

    res.json({ message: "Rejected successfully" });

  } catch (err) {
    console.error("HOD Reject Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getApprovedForExamCell = async (req, res) => {
  try {
    const approvedQBs = await QuestionBank.find({
      status: "HOD_APPROVED"
    }).populate("uploadedBy", "name email department");

    res.json(approvedQBs);

  } catch (err) {
    console.error("ExamCell Fetch Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getMyQuestionBanks = async (req, res) => {
  try {
    const qbs = await QuestionBank.find({
      uploadedBy: req.user.id
    }).sort({ createdAt: -1 });

    res.json(qbs);

  } catch (err) {
    console.error("Teacher Fetch Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

