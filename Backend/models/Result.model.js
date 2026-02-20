const mongoose = require("mongoose");

const resultSchema = new mongoose.Schema({
  attemptId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Attempt",
    required: true,
    unique: true // 🚫 one result per attempt
  },

  examId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Exams",
    required: true
  },

  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: true
  },

  score: {
    type: Number,
    required: true
  },

  total: {
    type: Number,
    required: true
  },

  percentage: {
    type: Number
  },

  passed: {
    type: Boolean
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Result", resultSchema);
