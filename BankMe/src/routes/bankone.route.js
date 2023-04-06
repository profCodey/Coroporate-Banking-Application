const express = require("express");
const router = express.Router();

const {
  getAccountByAccountNo,
  getAccountByCustomerID,
  getTransactionHistory,
  getAccountStatement,
  getNameEnquiry,
  getTransactionsPaginated,
  interbankTransfer,
  intrabankTransfer,
   getAccountDetails,
  getAccountInfo,
  getTransactionStatus
} = require("../controller/bankone/bankDetails");
const { adminAuth } = require("../middleware/auth");


router.get("/detail/:customerId", adminAuth, getAccountByCustomerID);
router.get("/balance", adminAuth, getAccountByAccountNo);
router.get("/history", adminAuth, getTransactionHistory);
router.get("/statement/:account", adminAuth, getAccountStatement);
router.post("/name-enquiry", adminAuth, getNameEnquiry);
router.get("/transactions/:account", adminAuth, getTransactionsPaginated);
router.post("/transfer/interbank", adminAuth, interbankTransfer);
router.post("/transfer/intrabank", adminAuth, intrabankTransfer);
router.post("/details", adminAuth, getAccountDetails);
router.get("/info", adminAuth, getAccountInfo);
router.post("/status", adminAuth, getTransactionStatus);

module.exports = router;