import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
  department: String,
  stream: String,
  section: String,
  rollNumber: String
}, { timestamps: true });

export default mongoose.model("Student", studentSchema);
