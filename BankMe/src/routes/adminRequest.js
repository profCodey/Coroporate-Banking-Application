const express = require("express");
const router = express.Router();

const {
  getAllAdminRequests,
  getMyRequests,
  createAdminRequests,
  superUserResponseById,
} = require("../controller/appCommunication/adminRequest");

const { adminAuth, superUserAuth } = require("../middleware/auth");

router.get("/all", superUserAuth, getAllAdminRequests);
router.get("/all:id", adminAuth, getMyRequests);
router.post("/create", adminAuth, createAdminRequests);
router.post("/response", superUserAuth, superUserResponseById);

module.exports = router;
