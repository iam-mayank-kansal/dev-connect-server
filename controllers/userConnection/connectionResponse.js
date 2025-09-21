const userConnectionModel = require("../../models/userConnections");
const userModel = require("../../models/user");
const { successTemplate, failureTemplate } = require("../../helper/template");
const logger = require("../../helper/logger");

async function connectionResponse(req, res) {
  try {
    const userId = req.user._id;
    const { fromUserId, status } = req.body;

    // find the pending request and populate user names
    const pendingConnection = await userConnectionModel
      .findOne({ fromUserId, toUserId: userId })
      .populate("fromUserId", "name") // only get name field
      .populate("toUserId", "name");

    if (!pendingConnection) {
      return res
        .status(404)
        .json(await failureTemplate(404, "No request found"));
    }

    const fromUserName = pendingConnection.fromUserId.name;
    const toUserName = pendingConnection.toUserId.name;

    if (status === "accepted") {
      // update status
      pendingConnection.status = "accepted";
      await pendingConnection.save();

      // add both users to each other’s connection list
      await userModel.bulkWrite([
        {
          updateOne: {
            filter: { _id: fromUserId },
            update: { $addToSet: { "connections.connected": userId } },
          },
        },
        {
          updateOne: {
            filter: { _id: userId },
            update: { $addToSet: { "connections.connected": fromUserId } },
          },
        },
      ]);
    } else if (status === "rejected") {
      await userConnectionModel.deleteOne({ _id: pendingConnection._id });

      await userModel.bulkWrite([
        {
          updateOne: {
            filter: { _id: fromUserId },
            update: { $pull: { "connections.sent": userId } },
          },
        },
        {
          updateOne: {
            filter: { _id: userId },
            update: { $pull: { "connections.received": fromUserId } },
          },
        },
      ]);
    }

    const userConnectionData = { fromUserName, toUserName, status };
    const message =
      status === "accepted"
        ? "Connection request accepted successfully"
        : "Connection request rejected successfully";

    logger.info(await successTemplate(200, message), {
      data: userConnectionData,
    });

    return res
      .status(200)
      .json(await successTemplate(200, message, userConnectionData));
  } catch (error) {
    console.error(error);
    logger.error(`Error in connectionResponse: ${error.message}`);
    return res
      .status(500)
      .json(await failureTemplate(500, "Internal Server Error"));
  }
}

module.exports = connectionResponse;
