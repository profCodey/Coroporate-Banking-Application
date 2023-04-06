const mongoose = require("mongoose");

const auditTrailSchema = new mongoose.Schema(
  {
    type: String,
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    transaction: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "InitiateRequest",
    },
    organization: {
      type: String
    },
    message: String
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("auditTrail", auditTrailSchema);
 