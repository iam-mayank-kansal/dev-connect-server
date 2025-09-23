const userConnectionModel = require("../../models/userConnections");
const userModel = require("../../models/user");
const { successTemplate, failureTemplate } = require("../../helper/template");
const logger = require("../../helper/logger");

async function connectionResponse(req, res) {
  try {
    const userId = req.user._id;
    const { fromUserId, status } = req.body;
    const normalizedStatus = status.toLowerCase();

    // The validator has already attached the pending connection document.
    const pendingConnection = req.pendingConnection;

    let message = "";

    // 1. Handle the 'accepted' status
    if (normalizedStatus === "accepted") {
      // Update the main connection document's status
      await userConnectionModel.updateOne(
        { _id: pendingConnection._id },
        { $set: { status: "accepted" } }
      );

      // Update the user models to add each user to the other's 'connected' list
      await userModel.bulkWrite([
        {
          updateOne: {
            filter: { _id: fromUserId },
            update: {
              $pull: { "connections.requestSent": userId }, // Remove from sent list
              $addToSet: { "connections.connected": userId }, // Add to connected list
            },
          },
        },
        {
          updateOne: {
            filter: { _id: userId },
            update: {
              $pull: {
                "connections.requestReceived": fromUserId, // Remove from received list
                "connections.ignored": fromUserId, // Corrected: Also remove from ignored list
              },
              $addToSet: { "connections.connected": fromUserId }, // Add to connected list
            },
          },
        },
      ]);
      message = "Connection request accepted successfully";
    }

    // 2. Handle the 'rejected' status
    else if (normalizedStatus === "rejected") {
      // For a rejection, delete the pending connection document
      await userConnectionModel.deleteOne({ _id: pendingConnection._id });

      // Update the user models to remove the sent/received request entries
      await userModel.bulkWrite([
        {
          updateOne: {
            filter: { _id: fromUserId },
            update: { $pull: { "connections.requestSent": userId } },
          },
        },
        {
          updateOne: {
            filter: { _id: userId },
            update: {
              $pull: {
                "connections.requestReceived": fromUserId,
                "connections.ignored": fromUserId,
              },
            },
          },
        },
      ]);
      message = "Connection request rejected successfully";
    }

    // 3. Prepare and send the final response
    const userConnectionData = {
      fromUserId,
      toUserId: userId,
      status: normalizedStatus,
    };

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
      message: `Error in connectionResponse controller: ${error.message}`,
    });
    return res
      .status(500)
      .json(await failureTemplate(500, "Internal Server Error"));
  }
}

module.exports = connectionResponse;
