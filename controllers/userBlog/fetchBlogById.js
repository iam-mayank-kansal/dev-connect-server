const blogModel = require("../../models/blog");
const { failureTemplate, successTemplate } = require("../../helper/template");
const { sendError } = require("../../helper/template");
const logger = require("../../helper/logger");
const validateMongoId = require("../../helper/validateMongooseId");

async function fetchBlogById(req, res) {
  try {
    const { blogId } = req.params;

    // Validate blogId
    if (!validateMongoId(blogId)) {
      return sendError(res, "Invalid blog ID");
    }

    const blog = await blogModel
      .findById(blogId)
      .select("-updatedAt -__v")
      .populate("userId", "name designation profilePicture");

    if (!blog) {
      return sendError(res, "Blog not found");
    }

    logger.log({
      level: "info",
      action: `Blog fetched by ID: ${blogId}`,
      message: await successTemplate(200, `Blog fetched successfully`, blog),
    });

    res
      .status(200)
      .json(await successTemplate(200, `Blog fetched successfully`, blog));
  } catch (error) {
    logger.log({
      level: "error",
      message: `Error in fetchBlogById controller: ${error.message}`,
    });
    return res
      .status(500)
      .json(await failureTemplate(500, "Internal Server Error"));
  }
}

module.exports = fetchBlogById;
