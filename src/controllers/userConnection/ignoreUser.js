const { successTemplate, failureTemplate } = require("../../helper/template");
const logger = require("../../helper/logger");
const userModel = require("../../models/user");
const userConnectionModel = require("../../models/userConnections");

async function ignoreUser(req, res) {
  try {
    const userId = req.user._id;
    const { toUserId } = req.body;
    const existingConnection = req.existingConnection;

    if (existingConnection) {
      // Find which 'ignore' field is currently null and update it
      // Note: Validator ensures we haven't already ignored them, so one slot must be free or taken by the other user
      if (!existingConnection.ignore?.user1) {
        await userConnectionModel.updateOne(
          { _id: existingConnection._id },
          { $set: { "ignore.user1": userId } }
        );
      } else if (!existingConnection.ignore?.user2) {
        await userConnectionModel.updateOne(
          { _id: existingConnection._id },
          { $set: { "ignore.user2": userId } }
        );
      }
    } else {
      // If no connection exists, create a new one with the current user as the ignorer
      await userConnectionModel.create({
        fromUserId: userId,
        toUserId: toUserId,
        status: "none",
        ignore: { user1: userId, user2: null },
      });
    }

    // Update user models to add the user to the 'ignored' list
    await userModel.bulkWrite([
      {
        updateOne: {
          filter: { _id: userId },
          update: { $addToSet: { "connections.ignored": toUserId } },
        },
      },
    ]);

    const ignoredUserData = await userModel
      .findById(toUserId)
      .select("name designation email profilePicture _id")
      .lean();

    const message = "User ignored successfully";

    const responseData = {
      status: "ignored",
      ignoredUser: ignoredUserData,
    };

    logger.log({
      level: "info",
      message: successTemplate(200, message),
      data: responseData,
    });
    return res.status(200).json(successTemplate(200, message, responseData));
  } catch (error) {
    logger.log({
      level: "error",
      message: `Error in ignoreUser controller: ${error.message}`,
    });
    return res.status(500).json(failureTemplate(500, "Internal Server Error"));
  }
}

module.exports = ignoreUser;
