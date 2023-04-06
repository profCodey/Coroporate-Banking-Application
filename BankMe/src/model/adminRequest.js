const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const adminRequestSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectID,
      ref: "User",
    },
    role: String,
    topic: String,
    message: String,
    response: [{
      type: String,
    }]

    // status: {
    //   type: String,
    //   enum: ["pending", "closed"]
    // },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("AdminRequest", adminRequestSchema);
