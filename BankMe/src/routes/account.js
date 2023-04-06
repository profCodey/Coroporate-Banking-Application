const express = require("express");
const { validate, accountSchemas } = require("../validations");
const { superUserAuth, adminAuth } = require("../middleware/auth");

const router = express.Router();
const {
  getAllAccount,
  registerAccount,
  verifyAccount,
} = require("../controller/account");

router.post(
  "/register",
  superUserAuth,
  // validate(accountSchemas.createAccount, "body"),
  registerAccount
);

router.get("/all_accounts", getAllAccount);

router.get(
  "/verify-account/:token",
  // validate(accountSchemas.verifyAccount, "params"),
  verifyAccount
);

module.exports = router;