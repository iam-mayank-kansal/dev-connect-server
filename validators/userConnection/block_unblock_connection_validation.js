const { failureTemplate, sendError } = require("../../helper/template");
const logger = require("../../helper/logger");
const userModel = require("../../models/user");
const validateMongoId = require("../../helper/validateMongooseId");
const userConnectionModel = require("../../models/userConnections");

async function blockConnectionValidation(req, res, next) {
  try {
    const userId = req.user._id;
    const { toUserId, status } = req.body;

    // 1. Required fields and status validation
    if (!toUserId || !status) {
      return sendError(
        res,
        "Invalid request body. 'toUserId' and 'status' are required."
      );
    }

    const normalizedStatus = status.toLowerCase();

    if (normalizedStatus !== "block" && normalizedStatus !== "unblock") {
      return sendError(
        res,
        "Invalid status. Only 'block' or 'unblock' are allowed."
      );
    }

    // 2. Valid Mongo ID & Self-connection check
    if (!validateMongoId(toUserId)) {
      return sendError(res, "Invalid Mongo Document ID for 'toUserId'.");
    }
    if (String(toUserId) === String(userId)) {
      return sendError(res, "Cannot block or unblock yourself.");
    }

    // 3. Target user must exist
    const existingUser = await userModel.findById(toUserId);
    if (!existingUser) {
      return sendError(res, "Target user does not exist.", 404);
    }

    // 4. Find any existing connection between the two users
    const existingConnection = await userConnectionModel.findOne({
      $or: [
        { fromUserId: userId, toUserId: toUserId },
        { fromUserId: toUserId, toUserId: userId },
      ],
    });

    // Determine who has blocked whom
    const isBlocker =
      existingConnection &&
      (existingConnection.block?.user1?.equals(userId) ||
        existingConnection.block?.user2?.equals(userId));

    // 5. Logic for blocking
    if (normalizedStatus === "block") {
      if (isBlocker) {
        return sendError(res, "You have already blocked this user.");
      }
      // A block is an absolute action that can proceed regardless of the other user's status.
      logger.log({
        level: "info",
        message: "Block request is valid. Proceeding to controller.",
      });
      // Attach existing connection for the controller to use
      req.existingConnection = existingConnection;
      next();
      return;
    }

    // 6. Logic for unblocking
    if (normalizedStatus === "unblock") {
      if (!existingConnection) {
        return sendError(
          res,
          "Cannot unblock a user with no existing connection.",
          404
        );
      }
      if (!isBlocker) {
        return sendError(
          res,
          "You cannot unblock this user as you have not blocked them.",
          403
        );
      }
      // The unblock request is valid.
      logger.log({
        level: "info",
        message: "Unblock request is valid. Proceeding to controller.",
      });
      // Attach existing connection for the controller to use
      req.existingConnection = existingConnection;
      next();
      return;
    }

    // Fallback for any other status (should be caught by step 2, but good for safety)
    return sendError(res, "Invalid status provided.");
  } catch (error) {
    logger.log({
      level: "error",
      message: `Error in blockConnectionValidation: ${error.message}`,
    });
    return res
      .status(500)
      .json(await failureTemplate(500, "Internal Server Error"));
  }
}

module.exports = blockConnectionValidation;
