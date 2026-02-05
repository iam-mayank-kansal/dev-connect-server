const blogModel = require("../../models/blog");
const userModel = require("../../models/user");
const { failureTemplate, successTemplate } = require("../../helper/template");
const logger = require("../../helper/logger");

async function fetchBlogs(req, res) {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

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

    let blogs = await blogModel
      .find(query)
      .select("-updatedAt -__v")
      .populate("userId", "name designation profilePicture connections")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Filter out blogs from users who blocked the current user
    if (req.user?._id) {
      const currentUserId = req.user._id;
      blogs = blogs.filter((blog) => {
        if (!blog.userId) return true; // Skip if user not found
        const blogUserBlockedList = blog.userId.connections?.blocked || [];
        return !blogUserBlockedList.some(
          (blockedId) => blockedId.toString() === currentUserId.toString()
        );
      });
    }

    const totalCount = await blogModel.countDocuments(query);
    const totalPages = Math.ceil(totalCount / limit);

    logger.log({
      level: "info",
      action: `Blogs fetched with pagination (page ${page}, limit ${limit})`,
      message: await successTemplate(200, `Blogs fetched successfully`, {
        blogs,
        pagination: {
          currentPage: page,
          limit,
          totalCount,
          totalPages,
        },
      }),
    });

    res.status(200).json(
      await successTemplate(200, `Blogs fetched successfully`, {
        blogs,
        pagination: {
          currentPage: page,
          limit,
          totalCount,
          totalPages,
        },
      })
    );
  } catch (error) {
    logger.log({
      level: "error",
      message: `Error in fetchBlogs controller: ${error.message}`,
    });
    return res
      .status(500)
      .json(await failureTemplate(500, "Internal Server Error"));
  }
}

module.exports = fetchBlogs;
