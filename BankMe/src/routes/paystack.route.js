const express = require("express");
const { getBankList, resolveAccount } = require("../controller/paystack");

const router = express.Router();

router.get("/bank-list", getBankList);
router.post("/resolve-account", resolveAccount)

module.exports = router;