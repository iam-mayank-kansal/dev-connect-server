const userConnectionModel = require("../../models/userConnections");
const userModel = require("../../models/user");
const { successTemplate, failureTemplate } = require("../../helper/template");
const logger = require("../../helper/logger");

async function acceptConnection(req, res) {
  try {
    const userId = req.user._id; // the logged-in user
    const { fromUserId, status } = req.body;

    // find the pending request (from fromUserId → to userId)
    const connectionDoc = await userConnectionModel.findOne({
      fromUserId,
      toUserId: userId,
    });

    let fromUserName = "";
    let toUserName = "";

    // get user names for response
    const ids = [connectionDoc.fromUserId, connectionDoc.toUserId];
    const getUserConnectionNames = await userModel.aggregate([
      { $match: { _id: { $in: ids } } },
      { $addFields: { sortOrder: { $indexOfArray: [ids, "$_id"] } } },
      { $sort: { sortOrder: 1 } },
      { $project: { _id: 0, name: 1 } },
    ]);

    fromUserName = getUserConnectionNames[0]?.name || "";
    toUserName = getUserConnectionNames[1]?.name || "";

    // handle accepted / rejected
    if (status === "accepted") {
      // update connection status
      await userConnectionModel.updateOne(
        { _id: connectionDoc._id },
        { $set: { status: "accepted" } }
      );

      // push both users into each other's accepted list
      await userModel.bulkWrite([
        {
          updateOne: {
            filter: { _id: fromUserId },
            update: { $addToSet: { "connections.accepted": userId } },
          },
        },
        {
          updateOne: {
            filter: { _id: userId },
            update: { $addToSet: { "connections.accepted": fromUserId } },
          },
        },
      ]);
    } else if (status === "rejected") {
      // remove the connection document
      await userConnectionModel.deleteOne({ _id: connectionDoc._id });
      await userModel.bulkWrite([
        {
          updateOne: {
            filter: { _id: fromUserId },
            update: { $pull: { "connections.accepted": userId } },
          },
        },
        {
          updateOne: {
            filter: { _id: userId },
            update: { $pull: { "connections.accepted": fromUserId } },
          },
        },
      ]);
    }

    // payload
    const userConnectionData = { fromUserName, toUserName, status };
    const messages = {
      accepted: "Connection request accepted successfully",
      rejected: "Connection request rejected successfully",
    };

    const message = messages[status];

    logger.log({
      level: "info",
      message: await successTemplate(200, message),
      data: userConnectionData,
    });

    return res
      .status(200)
      .json(await successTemplate(200, message, userConnectionData));
  } catch (error) {
    console.error(error);
    logger.log({
      level: "error",
      message: `Error in acceptConnection controller: ${error.message}`,
    });
    return res
      .status(500)
      .json(await failureTemplate(500, "Internal Server Error"));
  }
}

module.exports = acceptConnection;
