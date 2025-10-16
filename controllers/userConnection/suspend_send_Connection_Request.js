const {
  successTemplate,
  failureTemplate,
  sendError,
} = require("../../helper/template");
const logger = require("../../helper/logger");
const userModel = require("../../models/user");
const userConnectionModel = require("../../models/userConnections");

async function suspendConnection(req, res) {
  try {
    const userId = req.user._id;
    const { toUserId } = req.body;

    // Find and delete the connection request
    const deletedConnection = await userConnectionModel.findOneAndDelete({
      fromUserId: userId,
      toUserId: toUserId,
      status: "interested",
    });

    if (!deletedConnection) {
      return sendError(
        res,
        "Connection request not found or already withdrawn.",
        404
      );
    }

    // Update both users' connection arrays
    await userModel.bulkWrite([
      // Remove from current user's sent requests
      {
        updateOne: {
          filter: { _id: userId },
          update: { $pull: { "connections.requestSent": toUserId } },
        },
      },
      // Remove from recipient's received requests
      {
        updateOne: {
          filter: { _id: toUserId },
          update: { $pull: { "connections.requestReceived": userId } },
        },
      },
    ]);

    // Prepare response data
    const userConnectionData = {
      fromUserId: userId,
      toUserId: toUserId,
      action: "withdrawn",
    };

    const message = "Connection request withdrawn successfully.";

    // Log and send the success response
    logger.log({
      level: "info",
      message: await successTemplate(200, message),
      data: userConnectionData,
    });

    return res
      .status(200)
      .json(await successTemplate(200, message, userConnectionData));
  } catch (error) {
    logger.log({
      level: "error",
      message: `Error in suspendConnection controller: ${error.message}`,
    });
    return res
      .status(500)
      .json(await failureTemplate(500, "Internal Server Error"));
  }
}

module.exports = suspendConnection;
