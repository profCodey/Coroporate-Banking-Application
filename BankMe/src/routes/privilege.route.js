const express = require("express");
const router = express.Router();

const {
  getAllPrivileges,
  roleSwitchMailNotification,
  updateUserRole,
} = require("../controller/privilege/privilege.controller");
const { adminAuth } = require("../middleware/auth");

router.get("/", adminAuth, getAllPrivileges);
router.post("/", adminAuth, roleSwitchMailNotification);
router.get("/:token", adminAuth, updateUserRole);

module.exports = router;
