const express = require("express");
const router = express.Router();
const { validate, notificationsSchemas } = require("../validations");
const {
  getMyNotifications,
  deleteNotifications,
  markNotificationsAsRead,
} = require("../controller/notification/notification.controller");
const { allUsersAuth } = require("../middleware/auth");

router.get(
  "/mine",
  allUsersAuth,
  getMyNotifications
);
router.put(
  "/",
  allUsersAuth,
  validate(notificationsSchemas.notifications),
  markNotificationsAsRead
);
router.delete(
  "/",
  allUsersAuth,
  validate(notificationsSchemas.notifications),
  deleteNotifications
);

module.exports = router;
