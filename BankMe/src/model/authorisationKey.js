const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const authorisationKeySchema = new mongoose.Schema(
  {
    bankNumber: String,
    token: String,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("AuthorisationKey", authorisationKeySchema);
