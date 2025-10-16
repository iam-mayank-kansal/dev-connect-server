const { successTemplate, failureTemplate } = require("../../helper/template");
const logger = require("../../helper/logger");
const userModel = require("../../models/user");
const userConnectionModel = require("../../models/userConnections");

async function ignoreConnection(req, res) {
  try {
    const userId = req.user._id;
    const { toUserId, status } = req.body;
    const normalizedStatus = status.toLowerCase();

    // The validator has already confirmed that the request is valid and attached
    // the existing connection, if one exists.
    const existingConnection = req.existingConnection;

    // 1. Handle an 'ignore' request
    if (normalizedStatus === "ignore") {
      if (existingConnection) {
        // Find which 'ignore' field is currently null and update it
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
      const message = "User ignored successfully";
      const userConnectionData = { status: "ignored", toUserId: toUserId };

      logger.log({
        level: "info",
        message: await successTemplate(200, message),
        data: userConnectionData,
      });
      return res
        .status(200)
        .json(await successTemplate(200, message, userConnectionData));
    }

    // 2. Handle an 'unignore' request
    if (normalizedStatus === "unignore") {
      if (!existingConnection) {
        return res
          .status(404)
          .json(await failureTemplate(404, "Connection not found."));
      }

      // Remove the current user's ID from the ignore sub-document
      const updatedConnection = await userConnectionModel.findByIdAndUpdate(
        existingConnection._id,
        {
          $unset: {
            "ignore.user1": existingConnection.ignore?.user1?.equals(userId)
              ? 1
              : undefined,
            "ignore.user2": existingConnection.ignore?.user2?.equals(userId)
              ? 1
              : undefined,
          },
        },
        { new: true }
      );

      // If both block and ignore sub-documents are empty, delete the entire connection
      if (
        !updatedConnection.block?.user1 &&
        !updatedConnection.block?.user2 &&
        !updatedConnection.ignore?.user1 &&
        !updatedConnection.ignore?.user2
      ) {
        await userConnectionModel.deleteOne({ _id: updatedConnection._id });
      }

      // Update the user model by pulling from the 'ignored' list
      await userModel.bulkWrite([
        {
          updateOne: {
            filter: { _id: userId },
            update: { $pull: { "connections.ignored": toUserId } },
          },
        },
      ]);

      const message = "User unignored successfully";
      const userConnectionData = { status: "unignored", toUserId: toUserId };

      logger.log({
        level: "info",
        message: await successTemplate(200, message),
        data: userConnectionData,
      });
      return res
        .status(200)
        .json(await successTemplate(200, message, userConnectionData));
    }

    // Fallback for unexpected status (should be caught by the validator)
    return res.status(400).json(await failureTemplate(400, "Invalid status."));
  } catch (error) {
    logger.log({
      level: "error",
      message: `Error in ignoreConnection controller: ${error.message}`,
    });
    return res
      .status(500)
      .json(await failureTemplate(500, "Internal Server Error"));
  }
}

module.exports = ignoreConnection;
