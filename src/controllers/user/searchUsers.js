// File: src/controllers/user/searchUsers.js

// <-- THIS IS THE FIX: Use the correct path and model name
const userModel = require("../../models/user");

// Helper function to escape special regex characters
const escapeRegExp = (string) => {
  return string.replace(/[-\\^$*+?.()|[\]{}]/g, "\\$&");
};

const searchUsers = async (req, res) => {
  // 1. Get the search query from the URL (e.g., /api/users/search?q=mayank)
  const { q } = req.query;
  const currentUserId = req.user?._id; // Get current user from auth middleware

  // Fetch fresh user data from database to get latest blocked list
  let currentUserBlocked = [];
  if (currentUserId) {
    const currentUser = await userModel
      .findById(currentUserId)
      .select("connections.blocked");
    currentUserBlocked = currentUser?.connections?.blocked || [];
  }

  // 2. Handle empty or missing query
  if (!q) {
    return res.status(400).json({ msg: 'Search query "q" is required.' });
  }

  try {
    // 3. Create a safe, case-insensitive regex to find names that *start with* the query
    const safeQuery = escapeRegExp(q);
    const queryRegex = new RegExp(`^${safeQuery}`, "i");

    // 4. Build query to exclude blocked users
    const query = {
      $and: [
        { name: queryRegex }, // Search by name
        { _id: { $ne: currentUserId } }, // Don't show self
        { _id: { $nin: currentUserBlocked } }, // Don't show users I blocked
        { "connections.blocked": { $nin: [currentUserId] } }, // Don't show users who blocked me
      ],
    };

    // 5. Query the database (using userModel)
    const users = await userModel
      .find(query)
      .select("name profilePicture designation") // <-- Only send public data
      .limit(10); // <-- Limit results

    // 6. Send the results back as JSON
    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

module.exports = searchUsers;
