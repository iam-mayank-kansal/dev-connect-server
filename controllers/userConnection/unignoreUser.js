const { successTemplate, failureTemplate } = require("../../helper/template");
const logger = require("../../helper/logger");
const userModel = require("../../models/user");
const userConnectionModel = require("../../models/userConnections");

async function unignoreUser(req, res) {
  try {
    const userId = req.user._id;
    const { toUserId } = req.body;
    const existingConnection = req.existingConnection; // Verified by validator

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
  } catch (error) {
    logger.log({
      level: "error",
      message: `Error in unignoreUser controller: ${error.message}`,
    });
    return res
      .status(500)
      .json(await failureTemplate(500, "Internal Server Error"));
  }
}

module.exports = unignoreUser;
