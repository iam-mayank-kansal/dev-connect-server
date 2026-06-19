const blogModel = require("../../models/blog");
const userModel = require("../../models/user");
const { failureTemplate, successTemplate } = require("../../helper/template");
const logger = require("../../helper/logger");

async function listAllBlog(req, res) {
  try {
    // Build query to exclude blocked and ignored users
    const query = {};
    if (req.user?._id) {
      const currentUserId = req.user._id;
      // Fetch fresh user data from database to get latest blocked/ignored lists
      const currentUser = await userModel
        .findById(currentUserId)
        .select("connections");
      const blockedByMe = currentUser?.connections?.blocked || [];
      const ignoredByMe = currentUser?.connections?.ignored || [];

      // Exclude blogs from users I blocked or ignored
      query.userId = { $nin: [...blockedByMe, ...ignoredByMe] };
    }

    let listAllBlog = await blogModel
      .find(query)
      .select("-updatedAt  -__v")
      .populate("userId", "name designation profilePicture connections");

    // Filter out blogs from users who blocked the current user
    if (req.user?._id) {
      const currentUserId = req.user._id;
      listAllBlog = listAllBlog.filter((blog) => {
        if (!blog.userId) return true; // Skip if user not found
        const blogUserBlockedList = blog.userId.connections?.blocked || [];
        return !blogUserBlockedList.some(
          (blockedId) => blockedId.toString() === currentUserId.toString()
        );
      });
    }

    logger.log({
      level: "info",
      action: `All user blogs displayed successfully`,
      message: await successTemplate(
        201,
        `All user blogs displayed successfully`,
        listAllBlog
      ),
    });
    res
      .status(201)
      .json(
        await successTemplate(
          201,
          `All user blogs displayed successfully`,
          listAllBlog
        )
      );
  } catch (error) {
    logger.log({
      level: "error",
      message: `Error in listBlog controller: ${error.message}`,
    });
    return res
      .status(500)
      .json(await failureTemplate(500, "Internal Server Error"));
  }
}

module.exports = listAllBlog;
