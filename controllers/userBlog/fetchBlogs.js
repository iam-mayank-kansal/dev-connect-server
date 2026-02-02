const blogModel = require("../../models/blog");
const { failureTemplate, successTemplate } = require("../../helper/template");
const { sendError } = require("../../helper/template");
const logger = require("../../helper/logger");

async function fetchBlogs(req, res) {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const blogs = await blogModel
      .find({})
      .select("-updatedAt -__v")
      .populate("userId", "name designation profilePicture")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalCount = await blogModel.countDocuments({});
    const totalPages = Math.ceil(totalCount / limit);

    if (blogs.length === 0) {
      return sendError(res, "No blogs found");
    }

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
