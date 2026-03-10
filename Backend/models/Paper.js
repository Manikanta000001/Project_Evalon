const mongoose = require("mongoose");


const paperSchema = new mongoose.Schema(
  {
    meta: {
      regulation: String,
      examType: String,
      degree: String,
      department: String,
      year: String,
      semester: String,
      commonTo: [String],
      courseName: String,
      date: String,
      startTime: String,
      endTime: String,
      session: String,
    },

    questions: {
      type: Object, // your parsed backendResult
      required: true,
    },

    status: {
      type: String,
      enum: ["draft", "approved", "locked"],
      default: "draft",
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Paper", paperSchema);