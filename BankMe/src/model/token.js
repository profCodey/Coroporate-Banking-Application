const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const csrfSchema = new mongoose.Schema(
  {
    token: String,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Csrf", csrfSchema);
