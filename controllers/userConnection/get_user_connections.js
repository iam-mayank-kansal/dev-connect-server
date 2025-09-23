const { successTemplate, failureTemplate } = require("../../helper/template");
const logger = require("../../helper/logger");
const userModel = require("../../models/user");

async function getUserConnections(req, res) {
  try {
    const userId = req.user._id;
    const { status } = req.query;

    const userConnections = await userModel
      .findById(userId)
      .select("connections")
      .populate("connections.connected", "name designation email")
      .populate("connections.blocked", "name designation email")
      .populate("connections.requestReceived", "name designation email")
      .populate("connections.requestSent", "name designation email")
      .populate("connections.ignored", "name designation email")
      .lean();

    if (!userConnections) {
      return res
        .status(404)
        .json(await failureTemplate(404, "User not found."));
    }

    let filteredConnections = {};
    const allConnections = userConnections.connections;

    if (status) {
      const normalizedStatus = status.toLowerCase();
      // Check if the requested status is a valid connection type
      if (allConnections.hasOwnProperty(normalizedStatus)) {
        filteredConnections[normalizedStatus] =
          allConnections[normalizedStatus];
      } else {
        return res
          .status(400)
          .json(await failureTemplate(400, "Invalid connection status."));
      }
    } else {
      // If no status is provided, return all connections
      filteredConnections = allConnections;
    }

    const message = "User connections retrieved successfully.";

    // Log and send the success response
    logger.log({
      level: "info",
      message: await successTemplate(200, message),
      data: filteredConnections,
    });

    return res
      .status(200)
      .json(await successTemplate(200, message, filteredConnections));
  } catch (error) {
    logger.log({
      level: "error",
      message: `Error in getUserConnections controller: ${error.message}`,
    });
    return res
      .status(500)
      .json(await failureTemplate(500, "Internal Server Error"));
  }
}

module.exports = getUserConnections;
