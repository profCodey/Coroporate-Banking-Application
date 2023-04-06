const mongoose = require("mongoose");

const initiateRequestSchema = new mongoose.Schema(
  {
    mandate: {
      type: mongoose.Schema.Types.ObjectID,
      ref: "Mandate",
    },
    customerName: String,
    amount: Number,
    beneficiaryBankCode: String,
    beneficiaryAccountNumber: String,
    beneficiaryBankName: String,
    beneficiaryAccountName: String,
    beneficiaryPhoneNumber: String,
    beneficiaryAccountType: {
      type: String,
      enum: ["savings", "current"],
    },
    beneficiaryKYC: String,
    beneficiaryBVN: String,
    NIPSessionID: String,
    transactionReference: String,
    organizationId: String,
    numberOfAuthorisers: Number,
    transferStatus: {
      type: String,
      enum: ["pending", "successful", "failed"],
    },
    status: {
      type: String,
      enum: [
        "pending",
        "in progress",
        "awaiting verification",
        "approved",
        "declined",
      ],
      default: "pending",
    },
    initiator: {
      type: mongoose.Schema.Types.ObjectID,
      ref: "User",
    },
    authorisersAction: [
      {
        status: {
          type: String,
          enum: ["authorised", "rejected"],
        },
        authoriserID: {
          type: mongoose.Schema.Types.ObjectID,
          ref: "User",
        },
        reason: String,
      },
    ],
    verifierAction: {
      status: {
        type: String,
        enum: ["approved", "declined"],
      },
      reason: String,
    },
    type: {
      enum: ["inter-bank", "intra-bank"],
      type: String,
    },
    time: Date,
  },
  {
    timestamps: { type: Date, required: true, unique: true },
  }
);

module.exports = mongoose.model("InitiateRequest", initiateRequestSchema);
