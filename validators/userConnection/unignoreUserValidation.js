const { sendError, failureTemplate } = require("../../helper/template");
const logger = require("../../helper/logger");
const validateMongoId = require("../../helper/validateMongooseId");
const userConnectionModel = require("../../models/userConnections");

async function unignoreUserValidation(req, res, next) {
  try {
    const userId = req.user._id;
    const { toUserId } = req.body;

    // 1. Required fields
    if (!toUserId) {
      return sendError(res, "Invalid request body. 'toUserId' is required.");
    }

    // 2. Valid Mongo ID
    if (!validateMongoId(toUserId)) {
      return sendError(res, "Invalid Mongo Document ID for 'toUserId'.");
    }

    // 3. Find any existing connection
    const existingConnection = await userConnectionModel.findOne({
      $or: [
        { fromUserId: userId, toUserId: toUserId },
        { fromUserId: toUserId, toUserId: userId },
      ],
    });

    if (!existingConnection) {
      return sendError(
        res,
        "Cannot unignore a user with no existing connection.",
        404
      );
    }

    // 4. Check if actually ignored by me
    const isIgnoredByMe =
      existingConnection.ignore?.user1?.equals(userId) ||
      existingConnection.ignore?.user2?.equals(userId);

    if (!isIgnoredByMe) {
      return sendError(
        res,
        "You cannot unignore this user as you have not ignored them.",
        403
      );
    }

    // Request is valid
    logger.log({
      level: "info",
      message: "Unignore request is valid. Proceeding to controller.",
    });

    req.existingConnection = existingConnection;
    next();
  } catch (error) {
    logger.log({
      level: "error",
      message: `Error in unignoreUserValidation: ${error.message}`,
    });
    return res
      .status(500)
      .json(await failureTemplate(500, "Internal Server Error"));
  }
}

module.exports = unignoreUserValidation;
