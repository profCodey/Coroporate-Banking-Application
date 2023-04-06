const express = require("express");
const router = express.Router();
const {
  initiatorAuth,
  authoriserAuth,
  verifierAuth,
  allUsersAuth,
} = require("../middleware/auth");

const upload = require("../middleware/multer");

const {
  initiateRequest,
  declineRequest,
  approveRequest,
  getAllAssignedRequests,
  getAllRequestPerOrganization,
  getAllInitiatorRequests,
  getRequestById,
  verifierApproveRequest,  
  verifierDeclineRequest,
} = require("../controller/initiateRequest/initiateRequest.controller");
const batchUpload = require("../controller/batchUpload");

// initiate request
router.post("/initiate", initiatorAuth, initiateRequest);

// get all request for initiator
router.get("/initiator", initiatorAuth, getAllInitiatorRequests);

// get all assigned requests
router.get("/assigned", allUsersAuth, getAllAssignedRequests);

// get all request per organization
router.get("/all", allUsersAuth, getAllRequestPerOrganization);

// get request by id
router.get("/:id", allUsersAuth, getRequestById);

// update request
router.put("/authoriser/approve/:id", authoriserAuth, approveRequest);
router.put("/authoriser/decline/:id", authoriserAuth, declineRequest);
router.put("/verifier/decline/:id", verifierAuth,  verifierDeclineRequest);
router.put("/verifier/approve/:id", verifierAuth, verifierApproveRequest);

// bulk upload request
router.post("/upload", upload.single("file"), initiatorAuth, batchUpload);

module.exports = router;


