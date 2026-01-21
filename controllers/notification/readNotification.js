const NotificationModel = require("../../models/notification");
const { successTemplate, failureTemplate } = require("../../helper/template");
const logger = require("../../helper/logger");

async function readNotification(req, res) {
  try {
    const user = req.user;
    const { key, notificationId } = req.body;

    if (!key) {
      return res
        .status(400)
        .json(await failureTemplate(400, "key cannot be null or empty"));
    }
    if (key != "read") {
      return res
        .status(400)
        .json(
          await failureTemplate(
            400,
            "key value received is incorrect ! kindly pass the correct value"
          )
        );
    }

    //to avoid multiple update operation if notification is already been read
    const checkNotificationStatus = await NotificationModel.findOne({
      _id: notificationId,
      receiverId: user._id,
      status: key,
    });

    if (checkNotificationStatus) {
      return res
        .status(400)
        .json(await failureTemplate(400, "already notification has been read"));
    }

    //to update notification status to read from unread
    const readNotification = await NotificationModel.findOneAndUpdate(
      { _id: notificationId, receiverId: user._id, status: "unread" },
      { $set: { status: "read" } },
      { new: true }
    );
    // console.log(readNotification);

    logger.log({
      level: "info",
      message: await successTemplate(
        201,
        `notification read successfully`,
        readNotification
      ),
    });
    res
      .status(201)
      .json(
        await successTemplate(
          201,
          `notification read successfully`,
          readNotification
        )
      );
  } catch (error) {
    logger.log({
      level: "error",
      message: `Failed to read notification ${error.message}`,
    });
    return res.status(500).json({
      status: 500,
      message: "Failed to read notification",
    });
  }
}

module.exports = readNotification;
