
const mongoose = require("mongoose");
const Privilege = require("../model/privilege.model");

const privileges = [
  {
    name: "superUser",
    _id: mongoose.Types.ObjectId('63f697fd134e96cd95e2d97b'),
  },
  {
    name: "admin",
    _id: mongoose.Types.ObjectId('63f697a2177cf066f56c2abd'),
  },
  {
    name: 'verifier',
    _id: mongoose.Types.ObjectId('63f697bf78528f949a0c175b'),
  },
  {
    name: "authoriser",
    _id: mongoose.Types.ObjectId('63f69720653b38d4c0d792e9'),
  },
  {
    name: "initiator",
    _id: mongoose.Types.ObjectId('63f69765243023c496fe322d'),
  }
] 


const seedPrivileges = async () => {
  try {
    await Privilege.insertMany(privileges);
    console.log("Privileges seeded");
  } catch (error) {
    console.log(error);
  }
};

module.exports = seedPrivileges