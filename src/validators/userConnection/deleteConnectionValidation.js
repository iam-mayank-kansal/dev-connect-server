const { failureTemplate, sendError } = require("../../helper/template");
const logger = require("../../helper/logger");
const validateMongoId = require("../../helper/validateMongooseId");
const userConnectionModel = require("../../models/userConnections");

async function deleteConnectionValidation(req, res, next) {
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
      return sendError(res, "Cannot delete connection with yourself.");
    }

    // 3. Find existing connection
    const existingConnection = await userConnectionModel.findOne({
      $or: [
        { fromUserId: userId, toUserId: toUserId, status: "accepted" },
        { fromUserId: toUserId, toUserId: userId, status: "accepted" },
      ],
    });

    // 4. Check if the connection exists and is accepted
    if (!existingConnection) {
      return sendError(
        res,
        "No active connection found to delete. Either the connection doesn't exist or it's not in accepted status.",
        404
      );
    }

    // 5. Check if blocked
    const isBlockedByMe =
      existingConnection.block?.user1?.equals(userId) ||
      existingConnection.block?.user2?.equals(userId);
    const isBlockedByOther =
      existingConnection.block?.user1?.equals(toUserId) ||
      existingConnection.block?.user2?.equals(toUserId);

    if (isBlockedByMe || isBlockedByOther) {
      return sendError(
        res,
        "Cannot delete connection while blocking is active. Unblock the user first.",
        403
      );
    }

    // If all checks pass, proceed to the controller
    logger.log({
      level: "info",
      message: "DeleteConnection Validation Success",
    });
    next();
  } catch (error) {
    logger.log({
      level: "error",
      message: `Error in deleteConnectionValidation: ${error.message}`,
    });
    return res
      .status(500)
      .json(await failureTemplate(500, "Internal Server Error"));
  }
}

module.exports = deleteConnectionValidation;
