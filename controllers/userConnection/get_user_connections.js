const { successTemplate, failureTemplate } = require("../../helper/template");
const logger = require("../../helper/logger");
const userModel = require("../../models/user");

async function getUserConnections(req, res) {
  try {
    const userId = req.user._id;
    const { status } = req.query;

    // Fetch user with populated connections
    const userConnections = await userModel
      .findById(userId)
      .select("connections")
      .populate("connections.connected", "name designation email profilePicture")
      .populate("connections.blocked", "name designation email profilePicture")
      .populate("connections.requestReceived", "name designation email profilePicture")
      .populate("connections.requestSent", "name designation email profilePicture")
      .populate("connections.ignored", "name designation email profilePicture")
      .lean();

    if (!userConnections) {
      return res.status(404).json(
        await failureTemplate(404, "User not found.")
      );
    }

    const allConnections = userConnections.connections || {};
    let filteredConnections = {};

      // ✅ Define valid statuses with mapping to DB field names
      const validStatuses = {
        connected: "connected",
        blocked: "blocked",
        requestreceived: "requestReceived",
        requestsent: "requestSent",
        ignored: "ignored",
      };

    if (status) {
      const normalizedStatus = status.toLowerCase();

      if (validStatuses[normalizedStatus]) {
        const dbField = validStatuses[normalizedStatus];
        filteredConnections[dbField] = allConnections[dbField] || [];
      } else {
        return res.status(400).json(
          await failureTemplate(400, "Invalid connection status.")
        );
      }
    } else {
      // If no status provided, return all connections
      filteredConnections = allConnections;
    }

    const message = "User connections retrieved successfully.";

    // Log success
    logger.info({
      message,
      userId,
      connectionsCount: Object.keys(filteredConnections).length,
    });

    return res.status(200).json(
      await successTemplate(200, message, filteredConnections)
    );
  } catch (error) {
    logger.error({
      message: `Error in getUserConnections controller: ${error.message}`,
      stack: error.stack,
    });

    return res.status(500).json(
      await failureTemplate(500, "Internal Server Error")
    );
  }
}

module.exports = getUserConnections;
