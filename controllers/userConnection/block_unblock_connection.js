const { successTemplate, failureTemplate } = require("../../helper/template");
const logger = require("../../helper/logger");
const userModel = require("../../models/user");
const userConnectionModel = require("../../models/userConnections");

async function blockConnection(req, res) {
  try {
    const userId = req.user._id;
    const { toUserId, status } = req.body;
    const normalizedStatus = status.toLowerCase();

    // The validator has already confirmed that the request is valid.
    const existingConnection = req.existingConnection;

    // 1. Handle a 'block' request
    if (normalizedStatus === "block") {
      if (existingConnection) {
        // Find which 'block' field is currently null and update it
        let updateField = {};
        if (!existingConnection.block?.user1) {
          updateField = { "block.user1": userId };
        } else if (!existingConnection.block?.user2) {
          updateField = { "block.user2": userId };
        } else {
          // This case should be caught by the validator, but acts as a fail-safe.
          const message = "You have already blocked this user.";
          return res.status(400).json(await failureTemplate(400, message));
        }
        await userConnectionModel.updateOne(
          { _id: existingConnection._id },
          { $set: updateField }
        );
      } else {
        // If no connection exists, create a new one
        await userConnectionModel.create({
          fromUserId: userId,
          toUserId: toUserId,
          status: "none",
          block: { user1: userId, user2: null }, // Set user1 as the blocker
        });
      }

      // 🛑 FIX APPLIED HERE 🛑
      // We must update both user models:
      // 1. Add 'toUserId' to 'userId's blocked list.
      // 2. Remove 'toUserId' from 'userId's connection lists.
      // 3. Remove 'userId' from 'toUserId's connection lists (as was done before).

      await userModel.bulkWrite([
        // --- Updates for the User who is blocking (userId) ---
        {
          updateOne: {
            filter: { _id: userId },
            update: {
              $addToSet: { "connections.blocked": toUserId },
              $pull: {
                "connections.connected": toUserId,
                "connections.requestReceived": toUserId,
                "connections.requestSent": toUserId,
                "connections.ignored": toUserId,
              },
            },
          },
        },
        // --- Updates for the User who is being blocked (toUserId) ---
        {
          updateOne: {
            filter: { _id: toUserId },
            update: {
              $pull: {
                "connections.connected": userId, // Remove from connected
                "connections.requestReceived": userId, // Remove any pending request
                "connections.requestSent": userId, // Remove any sent request
                "connections.ignored": userId, // Remove from ignored
              },
            },
          },
        },
      ]);

      const message = "User blocked successfully";
      const userConnectionData = { status: "blocked", toUserId: toUserId };

      logger.log({
        level: "info",
        message: await successTemplate(200, message),
        data: userConnectionData,
      });
      return res
        .status(200)
        .json(await successTemplate(200, message, userConnectionData));
    }

    // 2. Handle an 'unblock' request
    if (normalizedStatus === "unblock") {
      // The validator has already confirmed the user is the blocker.
      // Remove the current user's ID from the block sub-document
      let unsetField = {};
      if (existingConnection.block?.user1?.equals(userId)) {
        unsetField = { "block.user1": null };
      } else if (existingConnection.block?.user2?.equals(userId)) {
        unsetField = { "block.user2": null };
      }

      const updatedConnection = await userConnectionModel.findByIdAndUpdate(
        existingConnection._id,
        {
          $unset: unsetField,
        },
        { new: true } // Return the updated document
      );

      // Check if both block and ignore sub-documents are empty, then delete the connection
      if (
        !updatedConnection.block?.user1 &&
        !updatedConnection.block?.user2 &&
        !updatedConnection.ignore?.user1 &&
        !updatedConnection.ignore?.user2
      ) {
        await userConnectionModel.deleteOne({ _id: updatedConnection._id });
      }

      // Update the user model by pulling the user from the 'blocked' list
      // 🛑 The original unblock logic seems fine as it only needs to remove the toUserId from the blocker's list.
      await userModel.bulkWrite([
        {
          updateOne: {
            filter: { _id: userId },
            update: { $pull: { "connections.blocked": toUserId } },
          },
        },
      ]);

      const message = "User unblocked successfully";
      const userConnectionData = { status: "unblocked", toUserId: toUserId };

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
      message: `Error in blockConnection controller: ${error.message}`,
    });
    return res
      .status(500)
      .json(await failureTemplate(500, "Internal Server Error"));
  }
}

module.exports = blockConnection;
