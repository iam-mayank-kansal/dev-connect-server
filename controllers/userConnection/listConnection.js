const userConnectionModel = require("../../models/userConnections");
const userModel = require("../../models/user");
const { successTemplate, failureTemplate } = require("../../helper/template");
const logger = require("../../helper/logger");
const { connections } = require("mongoose");

async function listConnection(req, res) {
  try {
    const userId = req.user._id; // the logged-in user
    const { status } = req.body;

    let ids = []; // here for all allowed status we will make array of ids based on our status

    // Step 1: Get IDs based on status
    if (status === "interested") {
    // incoming requests → from userConnection collection
    const requests = await userConnectionModel
        .find({ toUserId: userId, status: "interested" }, { fromUserId: 1, _id: 0 })
        .lean();

    ids = requests.map((r) => r.fromUserId);
    } else {
    // accepted / blocked → from userModel.connections
    const userConnectionIdlist = await userModel
        .findById(userId)
        .select(`connections.${status} -_id`)
        .lean();

    ids = userConnectionIdlist?.connections?.[status] || [];
    }

    
    // Step 2: Fetch user names for these IDs
    const users = await userModel
    .find({ _id: { $in: ids } }, { _id: 1, name: 1 })
    .lean();

    // Map for quick lookup --> it will retrun me a object as {id:name}
    const userMap = users.reduce((acc, u) => {
    acc[u._id.toString()] = u.name;
    return acc;
    }, {});

    // Step 3: Format final response
    const userConnectionData = ids.map((id) => ({
    id,
    name: userMap[id.toString()] || "user not found",
    }));

    // Messages
    const messages = {
    blocked: "Blocked Connections listed successfully",
    accepted: "Accepted Connections listed successfully",
    interested: "Interested Connections received successfully",
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

module.exports = listConnection;
