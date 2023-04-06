const express = require("express");
const {
  getOrganizationUsers,
  getUserProfile,
  changePassword,
  updateUserProfile,
  getAllUsers,
  deleteNonAdminUsers,
  deleteAnyUser,
} = require("../controller/user/user.controller");
const {
  adminAuth,
  allUsersAuth,
  superUserAuth,
} = require("../middleware/auth");

const router = express.Router();

//general route
router.get("/profile", allUsersAuth, getUserProfile);
router.put("/profile", allUsersAuth, updateUserProfile);
router.post("/change-password", allUsersAuth, changePassword);

//admin routes
router.get("/allbranchusers", adminAuth, getOrganizationUsers);
router.get("/all", adminAuth, getAllUsers);
router.delete("/delete_user", superUserAuth, deleteAnyUser);
router.delete("/delete_nonadmin", adminAuth, deleteNonAdminUsers);
// router.post("/priviledges", superUserAuth, createPriviledges);
module.exports = router;

deleteNonAdminUsers;
