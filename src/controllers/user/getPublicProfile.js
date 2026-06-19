const userModel = require("../../models/user");
const { successTemplate } = require("../../helper/template");
const logger = require("../../helper/logger");

async function getPublicProfile(req, res) {
  try {
    const profileUserId = req.params.userId;
    const loggedInUser = req.user;

    if (!profileUserId) {
      return res
        .status(400)
        .json({ success: false, message: "User ID parameter is missing" });
    }

    // --- 1. Handle "self" view first (fastest check) ---
    if (loggedInUser._id.toString() === profileUserId) {
      const selfProfile = await userModel
        .findById(loggedInUser._id)
        .select(
          "-password -updatedAt -resetToken -resetTokenExpiry -__v -role"
        );

      const responseData = {
        user: selfProfile,
        status: "self",
      };
      return res
        .status(200)
        .json(
          successTemplate(200, "Profile fetched successfully", responseData)
        );
    }

    // --- 2. Fetch profile-to-view AND logged-in-user's connections in parallel ---
    const [profileUser, loggedInUserConnections] = await Promise.all([
      userModel
        .findById(profileUserId)
        .select(
          "-password -updatedAt -resetToken -resetTokenExpiry -__v -role"
        ),
      userModel.findById(loggedInUser._id).select("connections"), // Fetch just the viewer's connections
    ]);

    // --- 3. Check if profile exists ---
    if (!profileUser) {
      logger.warn(`Public profile not found for ID: ${profileUserId}`);
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // --- 4. CRITICAL: Check if the profile user has blocked the logged-in user ---
    if (
      profileUser.connections.blocked.some(
        (id) => id.toString() === loggedInUser._id.toString()
      )
    ) {
      // Return 404 to discreetly hide the profile.
      logger.warn(
        `Profile access denied: ${profileUserId} blocked ${loggedInUser._id}`
      );
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // --- 5. Determine connection status from the logged-in user's perspective ---
    let connectionStatus = "not_connected"; // Default
    const connections = loggedInUserConnections.connections;
    const profileIdStr = profileUserId.toString();

    if (connections.blocked.some((id) => id.toString() === profileIdStr)) {
      connectionStatus = "blocked"; // You blocked them
    } else if (
      connections.connected.some((id) => id.toString() === profileIdStr)
    ) {
      connectionStatus = "connected";
    } else if (
      connections.requestSent.some((id) => id.toString() === profileIdStr)
    ) {
      connectionStatus = "requestSent";
    } else if (
      connections.requestReceived.some((id) => id.toString() === profileIdStr)
    ) {
      connectionStatus = "requestReceived";
    } else if (
      connections.ignored && // Check if 'ignored' list exists
      connections.ignored.some((id) => id.toString() === profileIdStr)
    ) {
      connectionStatus = "ignored"; // You ignored them
    }

    // --- 6. Sanitize the profile's connection data for public view ---

    // Convert to a plain JS object to safely modify it
    const publicProfileObject = profileUser.toObject();

    // Rebuild the 'connections' object to *only* include public data
    publicProfileObject.connections = {
      connected: publicProfileObject.connections.connected,
      // All other arrays (requestSent, requestReceived, blocked, ignored)
      // are now hidden from other users.
    };

    // --- 7. Send the combined response ---
    const responseData = {
      user: publicProfileObject, // Send the *sanitized* object
      status: connectionStatus,
    };

    logger.info({
      level: "info",
      action: "getPublicProfile",
      message: `Profile for ${profileUserId} viewed by ${loggedInUser._id}`,
    });

    res
      .status(200)
      .json(successTemplate(200, "Profile fetched successfully", responseData));
  } catch (error) {
    logger.error({
      level: "error",
      action: "getPublicProfile",
      message: error.message,
      error: error.stack,
    });
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
}

module.exports = getPublicProfile;
