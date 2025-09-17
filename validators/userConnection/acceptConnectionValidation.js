const { failureTemplate } = require("../../helper/template");
const logger = require("../../helper/logger");
const userModel = require("../../models/user");
const validateMongoId = require("../../helper/validateMongooseId");
const { COLLECTION_STATUS } = require("../../utils/enum");
const userConnectionModel = require("../../models/userConnections");


async function acceptConnectionValidation(req, res, next) {
  try {
    const userId = req.user._id;
    const { fromUserId, status } = req.body;

    // helper for error response
    const sendError = async (msg, code = 400) => {
      logger.log({ level: "info", message: await failureTemplate(code, msg) });
      return res.status(code).json(await failureTemplate(code, msg));
    };

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

    // 4. Target user must exist
    const existingUser = await userModel.findById(fromUserId);
    if (!existingUser) {
      return sendError("User doesn't exist");
    }

    // 5. Status validation (must be in enum, but not accepted)
    if (
      !COLLECTION_STATUS.includes(status.toLowerCase()) ||
      (status.toLowerCase() !== "accepted" && status.toLowerCase() !== "rejected")
    ) {
      return sendError(
        "Kindly pass status as accepted or rejected only"
      );
    }

    // 6. To Avoid Unneccessary db updation
    if(status==="accepted"){
      const checkAcceptedConnectionStatus=await userConnectionModel.findOne({fromUserId:fromUserId,status:"accepted"})
      if(checkAcceptedConnectionStatus){
        return sendError("Connection Request has already been accepted !")
      }
    }

    // Success
    logger.log({ level: "info", message: "AcceptConnection Validation Success" });
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

module.exports = acceptConnectionValidation;
