import mongoose from "mongoose";

const teacherSchema = new mongoose.Schema({
  collegeName: String,
  department: String,
  subject: String,
  occupation: String
}, { timestamps: true });

export default mongoose.model("Teacher", teacherSchema);
