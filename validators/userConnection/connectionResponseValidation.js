const { failureTemplate, sendError } = require("../../helper/template");
const logger = require("../../helper/logger");
const userModel = require("../../models/user");
const validateMongoId = require("../../helper/validateMongooseId");
const { COLLECTION_STATUS } = require("../../utils/enum");
const userConnectionModel = require("../../models/userConnections");

async function connectionResponseValidation(req, res, next) {
  try {
    const userId = req.user._id;
    const { fromUserId, status } = req.body;

    // 1. Required fields
    if (!fromUserId || !status) {
      return sendError("Invalid request body");
    }

    // 2. Valid Mongo ID
    if (!validateMongoId(fromUserId)) {
      return sendError("Invalid Mongo Document ID");
    }

    // 3. Cannot accept request to self
    if (userId.toString() === fromUserId.toString()) {
      return sendError("Cannot connect with yourself");
    }

    // 4. Status validation (must be in enum, but not accepted)
    if (
      !COLLECTION_STATUS.includes(status.toLowerCase()) ||
      (status.toLowerCase() !== "accepted" &&
        status.toLowerCase() !== "rejected")
    ) {
      return sendError("Kindly pass status as accepted or rejected only");
    }

    // 5. Target user must exist
    const existingUser = await userModel.findById(fromUserId);
    if (!existingUser) {
      return sendError("User doesn't exist");
    }

    // 6. To Avoid Unneccessary db updation
    if (status === "accepted") {
      const existingConnection = await userConnectionModel.findOne({
        fromUserId: fromUserId,
        toUserId: userId,
        status: "interested",
      });

      // 7. Check if a valid pending request exists
      if (!existingConnection) {
        logger.log({
          level: "warn",
          message: "No pending request found to accept or reject.",
        });
        return sendError(
          "There is no request available to either accept or reject!",
          404
        );
      }

      // 8. Handle the response based on the incoming status
      switch (normalizedStatus) {
        case "accepted":
          logger.log({
            level: "info",
            message: "Pending request found. Proceeding to accept.",
          });
          break;

        case "rejected":
          logger.log({
            level: "info",
            message: "Pending request found. Proceeding to reject.",
          });
          break;

        default:
          logger.log({
            level: "error",
            message:
              "Reached default case in switch. This indicates a logic error.",
          });
          return sendError("An unexpected error occurred.", 500);
      }

      logger.log({
        level: "info",
        message: "connection Response Validation Successful",
      });

      next();
    }
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

module.exports = connectionResponseValidation;
