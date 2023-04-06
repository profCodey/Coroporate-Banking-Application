const express = require("express");
const router = express.Router();
const {
  registerMandate,
  updateMandate,
  getAllMandates,
  getSingleMandate
} = require("../controller/mandate/mandate.controller");
const { validate, mandateSchemas } = require("../validations");
const {
  superUserAuth,
  adminAuth,
  allUsersAuth,
} = require("../middleware/auth");


router.post(
  "/create",
  validate(mandateSchemas.createMandate, "body"),
  adminAuth,
  registerMandate
);
router.put("/update", adminAuth, updateMandate);
router.get("/all", adminAuth, getAllMandates);
router.get("/:id", adminAuth);






module.exports = router;
