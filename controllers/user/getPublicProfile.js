const userModel = require("../../models/user");
const { successTemplate } = require("../../helper/template");
const logger = require("../../helper/logger");

/**
 * Fetches a public user profile and the connection status
 * relative to the logged-in user.
 * Assumes an authentication middleware adds `req.user`.
 */
async function getPublicProfile(req, res) {
  try {
    // 1. Get the ID of the profile to view from the URL parameters
    // This comes from the '/profile/:userId' part of your route
    const profileUserId = req.params.userId; // <-- This is the main fix

    // 2. Get the logged-in user's info (from your auth middleware)
    const loggedInUser = req.user;

    if (!profileUserId) {
      return res
        .status(400)
        .json({ success: false, message: "User ID parameter is missing" });
    }

    let connectionStatus = "not_connected"; // Default status

    // 3. Determine the connection status
    if (loggedInUser._id.toString() === profileUserId) {
      // The user is viewing their own profile
      connectionStatus = "self";
    } else {
      // The user is viewing someone else's profile.
      // We need the logged-in user's full connection data to check.
      // Note: req.user from your middleware might already have this.
      // Re-fetching is safer if you're not sure.
      const fullLoggedInUser = await userModel
        .findById(loggedInUser._id)
        .select("connections");

      if (
        fullLoggedInUser.connections.connected.some(
          (id) => id.toString() === profileUserId
        )
      ) {
        connectionStatus = "connected";
      } else if (
        fullLoggedInUser.connections.requestSent.some(
          (id) => id.toString() === profileUserId
        )
      ) {
        connectionStatus = "pending_sent";
      } else if (
        fullLoggedInUser.connections.requestReceived.some(
          (id) => id.toString() === profileUserId
        )
      ) {
        connectionStatus = "pending_received";
      } else if (
        fullLoggedInUser.connections.blocked.some(
          (id) => id.toString() === profileUserId
        )
      ) {
        connectionStatus = "blocked";
      }
      // If not in any list, it remains 'not_connected'
    }

    // 4. Find the user profile to display
    // Make sure to remove sensitive fields
    const profileUser = await userModel
      .findById(profileUserId)
      .select("-password -updatedAt -resetToken -resetTokenExpiry -__v -role");

    if (!profileUser) {
      logger.warn(`Public profile not found for ID: ${profileUserId}`);
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // 5. Send the combined response object as expected by the frontend
    const responseData = {
      user: profileUser,
      status: connectionStatus,
    };

    logger.info({
      level: "info",
      action: "getPublicProfile",
      message: `Profile for ${profileUserId} viewed by ${loggedInUser._id}`,
    });

    // Use your successTemplate, wrapping the new response object
    res
      .status(200)
      .json(
        await successTemplate(200, "Profile fetched successfully", responseData)
      );
  } catch (error) {
    logger.error({
      level: "error",
      action: "getPublicProfile",
      message: error.message,
      error: error.stack,
    });
    res
      .status(500)
      .json({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
  }
}

module.exports = getPublicProfile;
