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

    if (blogs.length === 0) {
      return sendError(res, `${user.name} hasn't posted any blogs yet`);
    }

    logger.log({
      level: "info",
      action: `${user.name} blogs fetched with pagination (page ${page}, limit ${limit})`,
      message: await successTemplate(
        200,
        `${user.name} blogs fetched successfully`,
        {
          blogs,
          pagination: {
            currentPage: page,
            limit,
            totalCount,
            totalPages,
          },
        }
      ),
    });

    res.status(200).json(
      await successTemplate(200, `${user.name} blogs fetched successfully`, {
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
      message: `Error in fetchUserBlogs controller: ${error.message}`,
    });
    return res
      .status(500)
      .json(await failureTemplate(500, "Internal Server Error"));
  }
}

module.exports = fetchUserBlogs;
