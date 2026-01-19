const express = require("express");
const notificationRouter = express.Router();

//auth middleware
const authRoute = require("../middleware/auth");

//notification imports
const getNotifications = require("../controllers/notification/getNotifications");
const readNotification = require("../controllers/notification/readNotification");

//notification routes
notificationRouter.get("/get-notifications", authRoute, getNotifications);
notificationRouter.post("/read-notification", authRoute, readNotification);

module.exports = notificationRouter;
