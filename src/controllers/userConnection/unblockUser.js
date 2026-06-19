const { successTemplate, failureTemplate } = require("../../helper/template");
const logger = require("../../helper/logger");
const userModel = require("../../models/user");
const userConnectionModel = require("../../models/userConnections");

async function unblockUser(req, res) {
  try {
    const userId = req.user._id;
    const { toUserId } = req.body;
    const existingConnection = req.existingConnection; // Verified by validator to exist

    // Determine which field to unset (Preserved logic)
    let unsetField = {};
    if (existingConnection.block?.user1?.equals(userId)) {
      unsetField = { "block.user1": null };
    } else if (existingConnection.block?.user2?.equals(userId)) {
      unsetField = { "block.user2": null };
    }

    const updatedConnection = await userConnectionModel.findByIdAndUpdate(
      existingConnection._id,
      { $unset: unsetField },
      { new: true }
    );

    // Check if document is empty (no blocks/ignores) -> Delete if true
    if (
      !updatedConnection.block?.user1 &&
      !updatedConnection.block?.user2 &&
      !updatedConnection.ignore?.user1 &&
      !updatedConnection.ignore?.user2
    ) {
      await userConnectionModel.deleteOne({ _id: updatedConnection._id });
    }

    // Update User model (Preserved logic)
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
  } catch (error) {
    logger.log({
      level: "error",
      message: `Error in unblockUser controller: ${error.message}`,
    });
    return res
      .status(500)
      .json(await failureTemplate(500, "Internal Server Error"));
  }
}

module.exports = unblockUser;
