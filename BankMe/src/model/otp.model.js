const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectID,
      ref: "User",
    },
    transaction: {
      type: mongoose.Schema.Types.ObjectID,
      ref: "InitiateRequest",
    },
    context: String,
    otp: String,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Otp", otpSchema);
