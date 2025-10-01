// controllers/connection/findConnection.js
const { successTemplate, failureTemplate } = require("../../helper/template");
const logger = require("../../helper/logger");
const userModel = require("../../models/user");

async function findConnection(req, res) {
  try {
    const userId = req.user._id;

    // Get current user's connections
    const user = await userModel.findById(userId).select("connections").lean();

    if (!user) {
      return res.status(404).json(
        await failureTemplate(404, "User not found.")
      );
    }

    // Collect all connected user IDs into a set
    const excludedIds = new Set([userId.toString()]); // start with self

    const { connections } = user;
    if (connections) {
      [
        ...(connections.connected || []),
        ...(connections.blocked || []),
        ...(connections.requestReceived || []),
        ...(connections.requestSent || []),
        ...(connections.ignored || []),
      ].forEach(id => excludedIds.add(id.toString()));
    }

    // Find users not in excludedIds
    const availableUsers = await userModel
      .find({ _id: { $nin: Array.from(excludedIds) } })
      .select("name designation email profilePicture") // only needed fields
      .lean();

    const message = "Available users for new connection retrieved successfully.";

    logger.info({
      message,
      userId,
      availableCount: availableUsers.length,
    });

    return res.status(200).json(
      await successTemplate(200, message, availableUsers)
    );
  } catch (error) {
    logger.error({
      message: `Error in findConnection controller: ${error.message}`,
      stack: error.stack,
    });

    return res.status(500).json(
      await failureTemplate(500, "Internal Server Error")
    );
  }
}

module.exports = findConnection;
