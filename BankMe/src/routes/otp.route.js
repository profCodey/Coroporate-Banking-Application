const express = require("express");
const { generateOTP } = require("../controller/sms/otp.controller");
const { allUsersAuth } = require("../middleware/auth");

const router = express.Router();

router.post("/generate", allUsersAuth, generateOTP);
router.post("/regenerate", allUsersAuth, generateOTP);

module.exports = router;
