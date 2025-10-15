const { successTemplate, failureTemplate } = require("../../helper/template");
const logger = require("../../helper/logger");
const userModel = require("../../models/user");
const userConnectionModel = require("../../models/userConnections");

async function deleteConnection(req, res) {
  try {
    const userId = req.user._id;
    const { toUserId } = req.body;

    // Find and delete the connection
    const deletedConnection = await userConnectionModel.findOneAndDelete({
      $or: [
        { fromUserId: userId, toUserId: toUserId, status: "accepted" },
        { fromUserId: toUserId, toUserId: userId, status: "accepted" },
      ],
    });

    if (!deletedConnection) {
      return sendError(res, "Connection not found or already deleted.", 404);
    }

    // Update both users' connection arrays
    await userModel.bulkWrite([
      // Remove from current user's connections
      {
        updateOne: {
          filter: { _id: userId },
          update: {
            $pull: {
              "connections.connected": toUserId,
              "connections.requestSent": toUserId,
              "connections.requestReceived": toUserId,
            },
          },
        },
      },
      // Remove from other user's connections
      {
        updateOne: {
          filter: { _id: toUserId },
          update: {
            $pull: {
              "connections.connected": userId,
              "connections.requestSent": userId,
              "connections.requestReceived": userId,
            },
          },
        },
      },
    ]);

    // Prepare response data
    const userConnectionData = {
      fromUserId: userId,
      toUserId: toUserId,
      action: "deleted",
    };

    const message = "Connection deleted successfully.";

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
      message: `Error in deleteConnection controller: ${error.message}`,
    });
    return res
      .status(500)
      .json(await failureTemplate(500, "Internal Server Error"));
  }
}

module.exports = deleteConnection;
