const userConnectionModel = require("../../models/userConnections");
const { successTemplate, failureTemplate } = require("../../helper/template");
const logger = require("../../helper/logger");

async function createConnection(req, res) {
  try {
    const userId = req.user._id;
    const { toUserId, status } = req.body;

    const newUser = {
      fromUserId: userId,
      toUserId: toUserId,
      status: status,
    };
    const newUserConnection = await userConnectionModel.create(newUser);
    logger.log({
      level: "info",
      message: await successTemplate(200, "connection request sent successfully"),
    });
    return res
      .status(201)
      .json(await successTemplate(200, "connection request sent successfully"));
  
  } catch (error) {
    logger.log({
      level: "error",
      message: `Error in updateUser controller: ${error.message}`,
    });
    return res
      .status(500)
      .json(await failureTemplate(500, "Internal Server Error"));
  }
}

module.exports = createConnection;
