const mongoose =require('mongoose')

const studentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true
    },
    password: {
      type: String,
      required: true
    },

    rollNumber: {
      type: String,
      required: true,
      unique: true // e.g. "22711"
    },

    admissionBatch: {
      type: String, // "22"
      required: true,
      immutable: true
    },

    currentBatch: {
      type: String, // "23" (can change if detained)
      required: true
    },

    collegeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "College",
      required: true
    },

    department: {
      type: String,
      required: true // CSE, ECE, etc.
    },

    section: {
      type: String,
      required: true // A, B, C
    },

    role: {
      type: String,
      default: "student"
    },

    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);
studentSchema.index({
  department: 1,
  section: 1,
  currentBatch: 1
});


module.exports = mongoose.model("Student", studentSchema);
