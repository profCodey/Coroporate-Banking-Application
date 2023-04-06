const express = require("express");
const router = express.Router();
const csrf = require("csurf");

const  generateCSRFToken  = require("../controller/security/csrfToken");
const { initiateRequest } = require("../controller/initiateRequest/initiateRequest.controller");
const { allUsersAuth, initiatorAuth } = require("../middleware/auth");

// Set up CSRF middleware
const csrfProtection = csrf({ cookie: true });


router.get("/csrf-token", allUsersAuth, csrfProtection, generateCSRFToken);
router.post("/initiate", initiatorAuth, csrfProtection, initiateRequest);




module.exports = router;