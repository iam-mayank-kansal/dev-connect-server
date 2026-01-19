const { successTemplate, failureTemplate } = require("../../helper/template");
const logger = require("../../helper/logger");
const userModel = require("../../models/user");
const userConnectionModel = require("../../models/userConnections");
const handleNotification = require("../../helper/notification");

async function sendConnection(req, res) {
  try {
    const userId = req.user._id;
    const { toUserId } = req.body;

    // The validator has already confirmed that no connection exists.
    // So we can safely create a new one.
    const newConnection = await userConnectionModel.create({
      fromUserId: userId,
      toUserId: toUserId,
      status: "interested",
    });

    // Update the user models to reflect the new request
    await userModel.bulkWrite([
      // Add the toUserId to the current user's 'sent' connections list
      {
        updateOne: {
          filter: { _id: userId },
          update: { $addToSet: { "connections.requestSent": toUserId } },
        },
      },
      // Add the userId to the recipient's 'received' connections list
      {
        updateOne: {
          filter: { _id: toUserId },
          update: { $addToSet: { "connections.requestReceived": userId } },
        },
      },
    ]);

    // Prepare response data for clarity using populate
    const populatedConnection = await userConnectionModel
      .findById(newConnection._id)
      .populate("fromUserId", "name")
      .populate("toUserId", "name")
      .lean();

    const fromUserName = populatedConnection.fromUserId?.name || "";
    const toUserName = populatedConnection.toUserId?.name || "";

    const userConnectionData = {
      fromUserName,
      toUserName,
      status: "interested",
    };

    const message = "Connection request sent successfully.";

    // helper fn for sending notification to reciver user (toUserName)
    const eventName = "send-connectionRequest";
    const eventDesc = `received connection request from ${toUserName}`;

    handleNotification(userId, toUserId, eventName, eventDesc, res);

    // Log and send the success response
    logger.log({
      level: "info",
      message: await successTemplate(201, message),
      data: userConnectionData,
    });
    return res
      .status(201)
      .json(await successTemplate(201, message, userConnectionData));
  } catch (error) {
    logger.log({
      level: "error",
      message: `Error in sendConnection controller: ${error.message}`,
    });
    return res
      .status(500)
      .json(await failureTemplate(500, "Internal Server Error"));
  }
}

module.exports = sendConnection;
