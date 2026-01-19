const NotificationModel = require("../../models/notification");
const { successTemplate } = require("../../helper/template");
const logger = require("../../helper/logger");

async function getNotifications(req, res) {
  const user = req.user;
  console.log(user);

  const displayNotifications = await NotificationModel.find({
    receiverId: user._id,
  });
  logger.log({
    level: "info",
    message: await successTemplate(
      201,
      `notification list fetched successfully`,
      displayNotifications
    ),
  });
  res
    .status(201)
    .json(
      await successTemplate(
        201,
        `notification list fetched successfully`,
        displayNotifications
      )
    );
}

module.exports = getNotifications;
