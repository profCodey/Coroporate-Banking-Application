
require("dotenv").config();
const mongoose = require("mongoose");
const seedPrivileges = require("./privilege.seed");

mongoose
  .set("strictQuery", false)
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected for seeding");
  }).catch(() => {
    console.log("MongoDB connection failed");
  })

const seedDb = async () => {
  await seedPrivileges();
};

seedDb().then(() => {
  mongoose.connection.close();
});


module.exports = seedDb;