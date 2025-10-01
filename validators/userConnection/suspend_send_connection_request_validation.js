const { failureTemplate, sendError } = require("../../helper/template");
const logger = require("../../helper/logger");
const validateMongoId = require("../../helper/validateMongooseId");
const userConnectionModel = require("../../models/userConnections");

async function suspendConnectionValidation(req, res, next) {
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
      return sendError(res, "Cannot suspend connection with yourself.");
    }

    // 3. Find existing connection
    const existingConnection = await userConnectionModel.findOne({
      fromUserId: userId,
      toUserId: toUserId,
      status: "interested"
    });

    // 4. Check if the connection request exists and belongs to the user
    if (!existingConnection) {
      return sendError(
        res, 
        "No pending connection request found to withdraw. Either the request doesn't exist, has already been processed, or you don't have permission to withdraw it.",
        404
      );
    }

    // 5. Check if connection is already accepted
    if (existingConnection.status === "accepted") {
      return sendError(
        res,
        "Cannot withdraw an accepted connection. You are already connected.",
        400
      );
    }

    // 6. Check if blocked
    const isBlockedByMe =
      existingConnection.block?.user1?.equals(userId) ||
      existingConnection.block?.user2?.equals(userId);
    const isBlockedByOther =
      existingConnection.block?.user1?.equals(toUserId) ||
      existingConnection.block?.user2?.equals(toUserId);

    if (isBlockedByMe) {
      return sendError(
        res,
        "You have blocked this user. Unblock them first to manage connections.",
        403
      );
    }
    if (isBlockedByOther) {
      return sendError(
        res,
        "You cannot withdraw this request. You have been blocked by this user.",
        403
      );
    }

    // If all checks pass, proceed to the controller
    logger.log({ level: "info", message: "SuspendConnection Validation Success" });
    next();
  } catch (error) {
    logger.log({
      level: "error",
      message: `Error in suspendConnectionValidation: ${error.message}`,
    });
    return res
      .status(500)
      .json(await failureTemplate(500, "Internal Server Error"));
  }
}

module.exports = suspendConnectionValidation;