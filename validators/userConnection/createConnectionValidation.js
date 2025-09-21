const { failureTemplate } = require("../../helper/template");
const logger = require("../../helper/logger");
const userModel = require("../../models/user");
const validateMongoId = require("../../helper/validateMongooseId");
const { COLLECTION_STATUS } = require("../../utils/enum");
const userConnectionModel = require("../../models/userConnections");

async function createConnectionValidation(req, res, next) {
  try {
    const userId = req.user._id;
    const { toUserId, status } = req.body;

    // helper for error response
    const sendError = async (msg, code = 400) => {
      logger.log({ level: "info", message: await failureTemplate(code, msg) });
      return res.status(code).json(await failureTemplate(code, msg));
    };

    // 1. Required fields
    if (!toUserId || !status) {
      return sendError("Invalid request body");
    }

    // 2. Valid Mongo ID
    if (!validateMongoId(toUserId)) {
      return sendError("Invalid Mongo Document ID");
    }

    // 3. Cannot send request to self
    if (toUserId === String(userId)) {
      return sendError("Self Connection request is not permitted");
    }

    // 4. Target user must exist
    const existingUser = await userModel.findById(toUserId);
    if (!existingUser) {
      return sendError("User doesn't exist");
    }

    // 5. Status validation (must be in enum, but not accepted)
    if (
      !COLLECTION_STATUS.includes(status.toLowerCase()) ||
      status.toLowerCase() === "accepted"
    ) {
      return sendError(
        "Kindly pass status as interested, blocked, or unblocked"
      );
    }

    // 6. Prevent duplicate "interested"
    if (status === "interested") {
      const existing = await userConnectionModel.findOne({
        $or: [
          { fromUserId: userId, toUserId, status: "interested" },
          { fromUserId: toUserId, toUserId: userId, status: "interested" },
          { fromUserId: userId, toUserId, status: "accepted" },
          { fromUserId: toUserId, toUserId: userId, status: "accepted" },
        ],
      });

      if (existing) {
        return sendError(
          "You already have a pending or accepted connection with this user."
        );
      }
    }
    // 7. Prevent duplicate "blocked"
    if (status === "blocked") {
      const existing = await userConnectionModel.findOne({
        fromUserId: userId,
        toUserId,
        status: "blocked",
      });
      if (existing) {
        return sendError("User has already been blocked");
      }
    }

    // 8. If user is blocked, no other action allowed except "unblocked"
    if (status !== "unblocked") {
      const blocked = await userConnectionModel.findOne({
        fromUserId: userId,
        toUserId,
        status: "blocked",
      });
      if (blocked) {
        return sendError("Kindly unblock user to perform action");
      }
    }

    // 9. Prevent "interested → unblocked" directly
    if (status === "unblocked") {
      const existing = await userConnectionModel.findOne({
        fromUserId: userId,
        toUserId,
      });
      if (existing && existing.status === "interested") {
        return sendError("You cannot unblock a user who was never blocked");
      }
    }

    // Success
    logger.log({
      level: "info",
      message: "CreateConnection Validation Success",
    });
    next();
  } catch (error) {
    logger.log({
      level: "error",
      message: `Error in createConnectionValidation: ${error.message}`,
    });
    return res
      .status(500)
      .json(await failureTemplate(500, "Internal Server Error"));
  }
}

module.exports = createConnectionValidation;
