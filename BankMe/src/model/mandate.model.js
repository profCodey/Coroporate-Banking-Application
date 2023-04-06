const mongoose = require("mongoose");

const mandateSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    minAmount: Number,
    maxAmount: Number,
    authorisers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    numberOfAuthorisers: Number,
    verifier: 
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Mandate", mandateSchema);
