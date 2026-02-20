const mongoose =require('mongoose')

const collegeSchema = new mongoose.Schema(
  {
    collegeCode: {
      type: String,
      required: true,
      unique: true, // e.g. "711"
      trim: true
    },
    name: {
      type: String,
      required: true
    },
    location: {
      type: String
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("College", collegeSchema);
