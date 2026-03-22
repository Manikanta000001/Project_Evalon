const express = require("express");
const router = express.Router();
const Attempt = require("../models/Attempt.model");

const {
  startExam,
  saveAnswer,
  submitExam,
  getMyResults
} = require("../controllers/exam.controller");

const {
  protect,
  authorizeRoles
} = require("../middleware/authMiddleware");


// 🟢 Start / Resume Exam (Student only)
router.post(
  "/start",
  protect,
  authorizeRoles("student"),
  startExam
);

// 🟡 Save answer (autosave) (Student only)
router.patch(
  "/save",
  protect,
  authorizeRoles("student"),
  saveAnswer
);

// 🔴 Submit exam (Student only)
router.post(
  "/submit",
  protect,
  authorizeRoles("student"),
  submitExam
);

// PATCH /api/attempt/flag
router.patch("/flag", async (req, res) => {
  const { attemptId, flags, type } = req.body;

  try {
    const attempt = await Attempt.findByIdAndUpdate(
      attemptId,
      {
        $inc: { flags: 1 },
        $push: {
          violations: {
            type,
            timestamp: new Date(),
          },
        },
      },
      { new: true }
    );
    console.log("flagadded")

    res.json({ success: true, flags: attempt.flags });
  } catch (err) {
    
    res.status(500).json({ message: "Failed to store flag" });
  }
});

module.exports = router;
