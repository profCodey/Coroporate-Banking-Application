const mongoose = require("mongoose");

const authQuestionsSchema = new mongoose.Schema(
    {
        authQuestions: [
            {
                type: String,
            }
        ],
    },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("AuthQuestions", authQuestionsSchema);
