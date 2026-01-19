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

  // 2. Handle empty or missing query
  if (!q) {
    return res.status(400).json({ msg: 'Search query "q" is required.' });
  }

  try {
    // 3. Create a safe, case-insensitive regex to find names that *start with* the query
    const safeQuery = escapeRegExp(q);
    const queryRegex = new RegExp(`^${safeQuery}`, "i");

    // 4. Query the database (using userModel)
    const users = await userModel
      .find({ name: queryRegex })
      .select("name profilePicture designation") // <-- Only send public data
      .limit(10); // <-- Limit results

    // 5. Send the results back as JSON
    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

module.exports = searchUsers;
