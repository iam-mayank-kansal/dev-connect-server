const userConnectionModel = require("../../models/userConnections");
const userModel = require("../../models/user");
const { successTemplate, failureTemplate } = require("../../helper/template");
const logger = require("../../helper/logger");

async function createConnection(req, res) {
  try {
    const userId = req.user._id;
    const { toUserId, status } = req.body;

    // always check existing connection
    const checkExistingConnection = await userConnectionModel.findOne({
      fromUserId: userId,
      toUserId: toUserId,
    });

    let connectionDoc = checkExistingConnection;

    if (!checkExistingConnection && status !== "unblocked") {
      connectionDoc = await userConnectionModel.create({
        fromUserId: userId,
        toUserId: toUserId,
        status,
      });
    }

    // handle block/unblock
    if (status === "blocked") {
      await userConnectionModel.updateOne(
        { fromUserId: userId, toUserId: toUserId },
        { status }
      );

      await userModel.bulkWrite([
        {
          updateOne: {
            filter: { _id: userId },
            update: { $addToSet: { "connections.blocked": toUserId } },
          },
        },
      ]);
    } else if (status === "unblocked") {
      await userConnectionModel.findOneAndDelete({
        fromUserId: userId,
        toUserId: toUserId,
      });

      await userModel.bulkWrite([
        {
          updateOne: {
            filter: { _id: userId },
            update: { $pull: { "connections.blocked": toUserId } },
          },
        },
      ]);
    }

    // prepare user names
    let fromUserName = "";
    let toUserName = "";

    if (status !== "unblocked" && connectionDoc) {
      const ids = [connectionDoc.fromUserId, connectionDoc.toUserId];

      const getUserConnectionNames = await userModel.aggregate([
        { $match: { _id: { $in: ids } } },
        { $addFields: { sortOrder: { $indexOfArray: [ids, "$_id"] } } },
        { $sort: { sortOrder: 1 } },
        { $project: { _id: 0, name: 1 } },
      ]);

      fromUserName = getUserConnectionNames[0]?.name || "";
      toUserName = getUserConnectionNames[1]?.name || "";
    }

    // final payload
    const userConnectionData = { fromUserName, toUserName, status };

    // response message mapping
    const messages = {
      interested: "connection request sent successfully",
      blocked: `${toUserName} user blocked successfully`,
      unblocked: `${toUserName || "User"} unblocked successfully`,
    };

    const message = messages[status] || "Connection updated successfully";

    logger.log({
      level: "info",
      message: await successTemplate(200, message),
      data: userConnectionData,
    });

    return res
      .status(201)
      .json(await successTemplate(200, message, userConnectionData));
  } catch (error) {
    console.error(error);
    logger.log({
      level: "error",
      message: `Error in createConnection controller: ${error.message}`,
    });
    return res
      .status(500)
      .json(await failureTemplate(500, "Internal Server Error"));
  }
}

module.exports = createConnection;
