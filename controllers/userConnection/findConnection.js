const { successTemplate, failureTemplate } = require("../../helper/template");
const logger = require("../../helper/logger");
const userModel = require("../../models/user");

async function findConnection(req, res) {
  try {
    const userId = req.user._id;

    // ============================================================
    // 1. EXTRACT & CALCULATE PAGINATION
    // ============================================================
    // Default to Page 1 and Limit 10 if frontend doesn't send them
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    // The Formula
    const skip = (page - 1) * limit;

    // ... [Your existing logic to find excludedIds remains exactly the same] ...

    // Get current user's connections
    const user = await userModel.findById(userId).select("connections").lean();
    if (!user) {
      return res
        .status(404)
        .json(await failureTemplate(404, "User not found."));
    }

    const excludedIds = new Set([userId.toString()]);
    const { connections } = user;

    if (connections) {
      [
        ...(connections.connected || []),
        ...(connections.blocked || []),
        ...(connections.requestReceived || []),
        ...(connections.requestSent || []),
        ...(connections.ignored || []),
      ].forEach((id) => excludedIds.add(id.toString()));
    }

    const usersHavingCurrentUser = await userModel
      .find({
        $or: [
          { "connections.connected": userId },
          { "connections.blocked": userId },
          { "connections.requestReceived": userId },
          { "connections.requestSent": userId },
          { "connections.ignored": userId },
        ],
      })
      .select("_id");

    usersHavingCurrentUser.forEach((u) => excludedIds.add(u._id.toString()));

    // ============================================================
    // 2. APPLY PAGINATION TO THE QUERY
    // ============================================================
    const availableUsers = await userModel
      .find({ _id: { $nin: Array.from(excludedIds) } })
      .select("name designation email profilePicture")
      .skip(skip) // <--- Skip previous items
      .limit(limit) // <--- Stop after taking 'limit' items
      .lean();

    // Optional: Check if there is more data (for the 'Load More' button)
    // We check if we got a full page. If we got less than 'limit', we are at the end.
    const hasMore = availableUsers.length === limit;

    const message = "Available users retrieved successfully.";

    // ============================================================
    // 3. SEND STRUCTURED RESPONSE
    // ============================================================
    const responseData = {
      users: availableUsers,
      pagination: {
        currentPage: page,
        limit: limit,
        hasMore: hasMore,
      },
    };

    logger.info({
      message,
      userId,
      page,
      count: availableUsers.length,
    });

    return res
      .status(200)
      .json(await successTemplate(200, message, responseData));
  } catch (error) {
    logger.error({
      message: `Error in findConnection controller: ${error.message}`,
      stack: error.stack,
    });

    return res
      .status(500)
      .json(await failureTemplate(500, "Internal Server Error"));
  }
}

module.exports = findConnection;
