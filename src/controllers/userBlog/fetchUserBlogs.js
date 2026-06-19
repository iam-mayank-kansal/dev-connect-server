const blogModel = require("../../models/blog");
const userModel = require("../../models/user");
const { failureTemplate, successTemplate } = require("../../helper/template");
const { sendError } = require("../../helper/template");
const logger = require("../../helper/logger");
const validateMongoId = require("../../helper/validateMongooseId");

async function fetchUserBlogs(req, res) {
  try {
    const { userId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Validate userId
    if (!validateMongoId(userId)) {
      return sendError(res, "Invalid user ID");
    }

    // Check if user exists
    const user = await userModel.findById(userId).select("name");
    if (!user) {
      return sendError(res, "User not found");
    }

    const blogs = await blogModel
      .find({ userId: userId })
      .select("-updatedAt -__v")
      .populate("userId", "name designation profilePicture")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalCount = await blogModel.countDocuments({ userId: userId });
    const totalPages = Math.ceil(totalCount / limit);

    logger.log({
      level: "info",
      action: `${user.name} blogs fetched with pagination (page ${page}, limit ${limit})`,
      message: `Fetched ${blogs.length} blogs for user`,
      totalCount,
      timestamp: new Date().toISOString(),
    });

    res.status(200).json(
      successTemplate(
        200,
        blogs.length === 0
          ? `${user.name} hasn't posted any blogs yet`
          : `${user.name} blogs fetched successfully`,
        {
          blogs,
          pagination: {
            currentPage: page,
            limit,
            totalCount,
            totalPages,
          },
        }
      )
    );
  } catch (error) {
    logger.log({
      level: "error",
      message: `Error in fetchUserBlogs controller: ${error.message}`,
    });
    return res
      .status(500)
      .json(await failureTemplate(500, "Internal Server Error"));
  }
}

module.exports = fetchUserBlogs;
