const { failureTemplate } = require("../../helper/template");
const logger = require("../../helper/logger");
const userModel = require("../../models/user");
const validateMongoId = require("../../helper/validateMongooseId");
const { COLLECTION_STATUS } = require("../../utils/enum");
const userConnectionModel = require("../../models/userConnections");

async function createConnectionValidation(req, res, next) {
  const userId = req.user._id;
  const { toUserId, status } = req.body;
  if ((!toUserId, !status)) {
    logger.log({
      level: "info",
      message: await failureTemplate(400, "invalid request body"),
    });
    return res
      .status(400)
      .json(await failureTemplate(400, "invalid request body"));
  }

  if (!validateMongoId(toUserId)) {
    logger.log({
      level: "info",
      message: await failureTemplate(400, "Invalid Mongo Document ID"),
    });
    return res
      .status(400)
      .json(await failureTemplate(400, "Invalid Mongo Document ID"));
  }

  const existingUser = await userModel.findById(toUserId);
  if (!existingUser) {
    logger.log({
      level: "info",
      message: await failureTemplate(400, "User doesn't exists"),
    });
    return res
      .status(400)
      .json(await failureTemplate(400, "User doesn't exists"));
  }

  if (
    !COLLECTION_STATUS.includes(status.toLowerCase()) ||
    status.toLowerCase() === "accepted"
  ) {
    logger.log({
      level: "info",
      message: await failureTemplate(
        400,
        "Kindly pass status as interested,ignored,accepted,blocked"
      ),
    });
    return res
      .status(400)
      .json(
        await failureTemplate(
          400,
          "Kindly pass status as interested,ignored,accepted,blocked"
        )
      );
  }

  const checkDuplicateConnectionRequest = await userConnectionModel.findOne({
    fromUserId: userId,
    toUserId:toUserId,
    status: "interested",
  });

  if(checkDuplicateConnectionRequest){
    logger.log({
      level: "info",
      message: await failureTemplate(
        400,
        "You already have a pending request with this user."
      ),
    });
    return res
      .status(400)
      .json(
        await failureTemplate(
          400,
          "You already have a pending request with this user."
        )
      );
  }


  logger.log({
    level: "info",
    message: "CreateConnection Validation Success",
  });

  next();
}

module.exports = createConnectionValidation;
