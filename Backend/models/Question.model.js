const mongoose = require("mongoose");

const TestCaseSchema = new mongoose.Schema({
  input: String,
  expectedOutput: String,
  isHidden: {
    type: Boolean,
    default: false
  }
}, { _id: false });

const QuestionSchema = new mongoose.Schema({
  examId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Exam",
    required: true
  },

  type: {
    type: String,
    enum: ["mcq", "coding"],
    required: true
  },

  // Common
  text: String,

  // MCQ
  options: [
    {
      index: Number,
      text: String
    }
  ],
  correctOptionIndex: Number,

  // Coding specific
  description: String,
  inputFormat: String,
  outputFormat: String,
  marks: Number,
  difficulty: {
    type: String,
    enum: ["Easy", "Medium", "Hard"]
  },
  testCases: [TestCaseSchema]
});

module.exports = mongoose.model("Question", QuestionSchema);
