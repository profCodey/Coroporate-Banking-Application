const express = require("express");
const router = express.Router();

const { getAllAuditTrail, getOrganizationAuditTrail } = require("../controller/auditTrail");
const { allUsersAuth, superUserAuth } = require("../middleware/auth");

router.get("/all", superUserAuth, getAllAuditTrail);
router.get("/organization", allUsersAuth, getOrganizationAuditTrail);


module.exports = router;