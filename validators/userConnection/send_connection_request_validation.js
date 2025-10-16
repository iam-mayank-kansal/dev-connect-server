const { failureTemplate, sendError } = require("../../helper/template");
const logger = require("../../helper/logger");
const userModel = require("../../models/user");
const validateMongoId = require("../../helper/validateMongooseId");
const userConnectionModel = require("../../models/userConnections");

async function sendConnectionValidation(req, res, next) {
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
      return sendError(res, "Self-connection is not permitted.");
    }

    // 3. Target user must exist
    const existingUser = await userModel.findById(toUserId);
    if (!existingUser) {
      return sendError(res, "Target user does not exist.", 404);
    }

    // 4. Find any existing connection to prevent duplicates
    const existingConnection = await userConnectionModel.findOne({
      $or: [
        { fromUserId: userId, toUserId: toUserId },
        { fromUserId: toUserId, toUserId: userId },
      ],
    });

    // 5. Check if a connection already exists and provide specific feedback
    if (existingConnection) {
      const status = existingConnection.status;
      const isBlockedByMe =
        existingConnection.block?.user1?.equals(userId) ||
        existingConnection.block?.user2?.equals(userId);
      const isBlockedByOther =
        existingConnection.block?.user1?.equals(toUserId) ||
        existingConnection.block?.user2?.equals(toUserId);
      const isIgnoredByMe =
        existingConnection.ignore?.user1?.equals(userId) ||
        existingConnection.ignore?.user2?.equals(userId);

      // A block is the highest-priority status.
      if (isBlockedByMe) {
        return sendError(
          res,
          "You have blocked this user. Unblock them first to send a request.",
          403
        );
      }
      if (isBlockedByOther) {
        return sendError(
          res,
          "You cannot send a connection request. You have been blocked by this user.",
          403
        );
      }

      // An 'ignore' only prevents the ignorer from sending requests.
      if (isIgnoredByMe) {
        return sendError(
          res,
          "You have ignored this user. Unignore them first to send a request.",
          403
        );
      }

      if (status === "interested") {
        const isSender =
          String(existingConnection.fromUserId) === String(userId);
        if (isSender) {
          return sendError(
            res,
            "You have a pending connection request with this user. No action required.",
            400
          );
        } else {
          return sendError(
            res,
            "This user has already sent you a connection request. Please accept, reject, or block them.",
            400
          );
        }
      }

      if (status === "accepted") {
        return sendError(res, "You are already connected to this user.", 400);
      }
    }

    // If all checks pass, proceed to the controller
    logger.log({ level: "info", message: "SendConnection Validation Success" });
    next();
  } catch (error) {
    logger.log({
      level: "error",
      message: `Error in sendConnectionValidation: ${error.message}`,
    });
    return res
      .status(500)
      .json(await failureTemplate(500, "Internal Server Error"));
  }
}

module.exports = sendConnectionValidation;
