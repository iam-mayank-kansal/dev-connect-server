const sendError = require("../../helper/sendError");
const logger = require("../../helper/logger");
const blogModel = require("../../models/blog");

async function deleteBlogValidation(req, res, next) {
  const userId = req.user._id;
  const { blogId } = req.body;

  // Blog ID is required
  if (!blogId) {
    return sendError(res, "Blog ID is required.");
  }

  // Check if the blog exists for this user
  const existingBlog = await blogModel.findOne({ userId, _id: blogId });

  if (!existingBlog) {
    return sendError(
      res,
      "No blog found with the provided blogID for the logged-in user!"
    );
  }

  logger.log({
    level: "info",
    message: `editBlogValidation validation successful`,
  });

  // Attach validated update object to request
  req.existingBlog = existingBlog;
  next();
}

module.exports = deleteBlogValidation;
