const { sendError, failureTemplate } = require("../../helper/template");
const logger = require("../../helper/logger");
const userModel = require("../../models/user");
const validateMongoId = require("../../helper/validateMongooseId");
const userConnectionModel = require("../../models/userConnections");

async function ignoreUserValidation(req, res, next) {
  try {
    const userId = req.user._id;
    const { toUserId } = req.body;

    // 1. Required fields
    if (!toUserId) {
      return sendError(res, "Invalid request body. 'toUserId' is required.");
    }

    // 2. Valid Mongo ID & Self-connection check
    if (!validateMongoId(toUserId)) {
      return sendError(res, "Invalid Mongo Document ID for 'toUserId'.");
    }
    if (String(toUserId) === String(userId)) {
      return sendError(res, "Cannot ignore yourself.");
    }

    // 3. Target user must exist
    const existingUser = await userModel.findById(toUserId);
    if (!existingUser) {
      return sendError(res, "Target user does not exist.", 404);
    }

    // 4. Find any existing connection
    const existingConnection = await userConnectionModel.findOne({
      $or: [
        { fromUserId: userId, toUserId: toUserId },
        { fromUserId: toUserId, toUserId: userId },
      ],
    });

    // Determine who has blocked/ignored whom
    const isBlockedByMe =
      existingConnection &&
      (existingConnection.block?.user1?.equals(userId) ||
        existingConnection.block?.user2?.equals(userId));

    const isIgnoredByMe =
      existingConnection &&
      (existingConnection.ignore?.user1?.equals(userId) ||
        existingConnection.ignore?.user2?.equals(userId));

    // 5. Logic for ignoring
    if (isBlockedByMe) {
      return sendError(
        res,
        "You cannot ignore this user. You have already blocked them."
      );
    }
    if (isIgnoredByMe) {
      return sendError(res, "You have already ignored this user.");
    }

    // Request is valid
    logger.log({
      level: "info",
      message: "Ignore request is valid. Proceeding to controller.",
    });

    req.existingConnection = existingConnection;
    next();
  } catch (error) {
    logger.log({
      level: "error",
      message: `Error in ignoreUserValidation: ${error.message}`,
    });
    return res
      .status(500)
      .json(await failureTemplate(500, "Internal Server Error"));
  }
}

module.exports = ignoreUserValidation;
