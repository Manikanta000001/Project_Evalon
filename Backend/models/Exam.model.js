const mongoose =require('mongoose')
const ExamSchema = new mongoose.Schema({
  title: String,
  durationMinutes: Number,
  passPercentage: Number,

  department: String,
  year: String,
  section: {
  type: [String], // Array of sections
  default: []
},


  startAt: Date,
  endAt: Date,
    codingPerStudent: {
    type: Number,
    default: 0
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Teacher",
    required: true
  },
    isCancelled: {
    type: Boolean,
    default: false
  },

  createdAt: { type: Date, default: Date.now }
});
ExamSchema.index({
  department: 1,
  year: 1,
  section: 1,
  startAt: 1,
  endAt: 1,
  createdBy: 1,
  createdAt: -1
});

module.exports = mongoose.model("Exams", ExamSchema);
