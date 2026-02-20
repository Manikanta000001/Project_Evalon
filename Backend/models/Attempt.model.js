const mongoose = require("mongoose");

const attemptSchema = new mongoose.Schema({
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

  answers: {
    type: Object, // { questionId: selectedIndex }
    default: {}
  },

  questionOrder: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Question"
    }
  ],

  status: {
    type: String,
    enum: ["in_progress", "submitted"],
    default: "in_progress"
  },

  startedAt: {
    type: Date,
    default: Date.now
  },

  submittedAt: {
    type: Date
  }
});
attemptSchema.index({
  studentId: 1,
  examId: 1,
  status: 1
});


module.exports = mongoose.model("Attempt", attemptSchema);
