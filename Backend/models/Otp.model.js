const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  otp: String,
  expiresAt: Date,

});

module.exports = mongoose.model("Otp", otpSchema);