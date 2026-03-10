const mongoose = require("mongoose");

const QuestionBankSchema = new mongoose.Schema({
    title: {
      type: String,
      required: true
    },

    subject: {
      type: String,
      required: true
    },

    department: {
      type: String,
      required: true
    },

    year: {
      type: String,
      required: true
    },

    fileUrl: {
      type: String,
      required: true
    },

    cloudinaryId: {
      type: String,
      required: true
    },

    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher",
      required: true
    },

    status: {
      type: String,
      enum: [
        "SUBMITTED",
        "HOD_APPROVED",
        "HOD_REJECTED",
        "PAPER_GENERATED"
      ],
      default: "SUBMITTED"
    },

    usedForPaper: {
      type: Boolean,
      default: false
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher"
    },

    approvedAt: {
      type: Date
    },

    remarks: [{
      role: String,
      comment: String,
      date: Date
    }],

  },

  {
    timestamps: true
  }
);

module.exports = mongoose.model("QuestionBank", QuestionBankSchema);