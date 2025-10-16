const { failureTemplate, sendError } = require("../../helper/template");
const logger = require("../../helper/logger");
const userModel = require("../../models/user");
const validateMongoId = require("../../helper/validateMongooseId");
const userConnectionModel = require("../../models/userConnections");

async function connectionResponseValidation(req, res, next) {
  try {
    const userId = req.user._id;
    const { fromUserId, status } = req.body;

    // 1. Required fields and status validation
    if (!fromUserId || !status) {
      return sendError(
        res,
        "Invalid request body. 'fromUserId' and 'status' are required."
      );
    }

    const normalizedStatus = status.toLowerCase();

    if (normalizedStatus !== "accepted" && normalizedStatus !== "rejected") {
      return sendError(
        res,
        "Invalid status. Only 'accepted' or 'rejected' are allowed."
      );
    }

    // 2. Valid Mongo ID & Self-connection check
    if (!validateMongoId(fromUserId)) {
      return sendError(res, "Invalid Mongo Document ID for 'fromUserId'.");
    }
    if (String(fromUserId) === String(userId)) {
      return sendError(
        res,
        "You cannot accept or reject a request from yourself."
      );
    }

    // 3. Target user must exist
    const existingUser = await userModel.findById(fromUserId);
    if (!existingUser) {
      return sendError(
        res,
        "The user who sent the request does not exist.",
        404
      );
    }

    // 4. Find the pending request
    const pendingConnection = await userConnectionModel.findOne({
      fromUserId: fromUserId,
      toUserId: userId,
      status: "interested",
    });

    // 5. Check if a valid pending request exists
    if (!pendingConnection) {
      return sendError(
        res,
        "There is no pending request from this user to accept or reject.",
        404
      );
    }

    // All checks pass. Attach the pending connection document to the request for the controller.
    req.pendingConnection = pendingConnection;
    logger.log({
      level: "info",
      message:
        "Connection response validation successful. Proceeding to controller.",
    });
    next();
  } catch (error) {
    logger.log({
      level: "error",
      message: `Error in connectionResponseValidation: ${error.message}`,
    });
    return res
      .status(500)
      .json(await failureTemplate(500, "Internal Server Error"));
  }
}

module.exports = connectionResponseValidation;
