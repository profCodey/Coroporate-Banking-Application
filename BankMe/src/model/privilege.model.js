const mongoose = require("mongoose");

const privilegeSchema = new mongoose.Schema(
  {
    name: String,
    _id: mongoose.Schema.Types.ObjectId,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Privilege", privilegeSchema);
