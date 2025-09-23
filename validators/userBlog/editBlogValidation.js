const sendError = require("../../helper/sendError");
const logger = require("../../helper/logger");
const blogModel = require("../../models/blog");

async function editBlogValidation(req, res, next) {
  const userId = req.user._id;
  const { blogId, blogTitle, blogBody, action } = req.body;

  // Blog ID is required
  if (!blogId) {
    return sendError(res, "Blog ID is required.");
  }

  // Check if the blog exists for this user
  const existingBlog = await blogModel.findOne({ userId, _id: blogId });
  
  if (!existingBlog) {
    return sendError(res, "No blog found for the logged-in user!");
  }


  // If action is provided, only allow "delete"
  // If action is delete, skip further validation and attach action info
  if (action !== undefined) {
    if (action !== "delete") {
      return sendError(res, 'Invalid action value. Only "delete" is allowed.');
    }
    req.updatedContent = { action: "delete", blogId };
    logger.log({ level: "info", message: "Blog marked for deletion" });
    return next();
  }

  // Build update object dynamically
  const updateFields = {};
  if (blogTitle !== undefined) updateFields.blogTitle = blogTitle;
  if (blogBody !== undefined) updateFields.blogBody = blogBody;
  if (blogId !== undefined) updateFields.blogId = blogId;

  // If nothing to update
  if (Object.keys(updateFields).length === 0) {
    return sendError(res, "No fields to update.");
  }

  // Validate blogTitle if provided
  if (blogTitle !== undefined) {
    if (typeof blogTitle !== "string") {
      return sendError(res, "blogTitle must be a string");
    }
    const title = blogTitle.trim();
    if (title.length === 0) {
      return sendError(res, "blogTitle cannot be empty");
    }
    if (title.length > 200) {
      return sendError(res, "blogTitle cannot exceed 200 characters");
    }
    updateFields.blogTitle = title;
  }

  // Validate blogBody if provided
  if (blogBody !== undefined) {
    if (typeof blogBody !== "string") {
      return sendError(res, "blogBody must be a string");
    }
    const body = blogBody.trim();
    if (body.length === 0) {
      return sendError(res, "blogBody cannot be empty");
    }
    if (body.length > 10000) {
      return sendError(res, "blogBody cannot exceed 10000 characters");
    }
    updateFields.blogBody = body;
  }

  logger.log({
    level: "info",
    message: `editBlogValidation validation successful`,
  });

  // Attach validated update object to request
  req.updatedContent = updateFields;
  next();
}

module.exports = editBlogValidation;
