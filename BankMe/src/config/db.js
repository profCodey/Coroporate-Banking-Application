const mongoose = require("mongoose");

const connectDB = async (URI, cb) => {
  try {
    await mongoose.set("strictQuery", false).connect(URI);
    console.clear();
    console.log("MongoDB connected");
    cb();
  } catch (error) {
    console.log(error);
  }
};

module.exports = connectDB;
