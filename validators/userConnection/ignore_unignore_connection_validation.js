const { failureTemplate, sendError } = require("../../helper/template");
const logger = require("../../helper/logger");
const userModel = require("../../models/user");
const validateMongoId = require("../../helper/validateMongooseId");
const userConnectionModel = require("../../models/userConnections");

async function ignoreConnectionValidation(req, res, next) {
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

    if (normalizedStatus !== "ignore" && normalizedStatus !== "unignore") {
      return sendError(
        res,
        "Invalid status. Only 'ignore' or 'unignore' are allowed."
      );
    }

    // 2. Valid Mongo ID & Self-connection check
    if (!validateMongoId(toUserId)) {
      return sendError(res, "Invalid Mongo Document ID for 'toUserId'.");
    }
    if (String(toUserId) === String(userId)) {
      return sendError(res, "Cannot ignore or unignore yourself.");
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
    const isBlockedByMe =
      existingConnection &&
      (existingConnection.block?.user1?.equals(userId) ||
        existingConnection.block?.user2?.equals(userId));
    const isIgnoredByMe =
      existingConnection &&
      (existingConnection.ignore?.user1?.equals(userId) ||
        existingConnection.ignore?.user2?.equals(userId));

    // 5. Logic for ignoring
    if (normalizedStatus === "ignore") {
      if (isBlockedByMe) {
        return sendError(
          res,
          "You cannot ignore this user. You have already blocked them."
        );
      }
      if (isIgnoredByMe) {
        return sendError(res, "You have already ignored this user.");
      }
      // If no block or ignore exists from my side, the request is valid.
      logger.log({
        level: "info",
        message: "Ignore request is valid. Proceeding to controller.",
      });
      req.existingConnection = existingConnection;
      next();
      return;
    }

    // 6. Logic for unignoring
    if (normalizedStatus === "unignore") {
      if (!existingConnection) {
        return sendError(
          res,
          "Cannot unignore a user with no existing connection.",
          404
        );
      }
      if (!isIgnoredByMe) {
        return sendError(
          res,
          "You cannot unignore this user as you have not ignored them.",
          403
        );
      }
      // The unignore request is valid.
      logger.log({
        level: "info",
        message: "Unignore request is valid. Proceeding to controller.",
      });
      req.existingConnection = existingConnection;
      next();
      return;
    }

    // Fallback for any other status
    return sendError(res, "Invalid status provided.");
  } catch (error) {
    logger.log({
      level: "error",
      message: `Error in ignoreConnectionValidation: ${error.message}`,
    });
    return res
      .status(500)
      .json(await failureTemplate(500, "Internal Server Error"));
  }
}

module.exports = ignoreConnectionValidation;
