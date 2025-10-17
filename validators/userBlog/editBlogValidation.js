const {sendError} = require("../../helper/template");
const logger = require("../../helper/logger");
const blogModel = require("../../models/blog");

async function editBlogValidation(req, res, next) {
  const userId = req.user._id;
  const { blogId, blogTitle, blogBody } = req.body;

  // Blog ID is required
  if (!blogId) {
    return sendError(res, "Blog ID is required.");
  }

  // Check if the blog exists for this user
  const existingBlog = await blogModel.findOne({ userId, _id: blogId });

  if (!existingBlog) {
    return sendError(res, "No blog found for the logged-in user!");
  }

  if (!blogTitle || !blogBody) {
    return sendError(res, "Blog Title and  Blog Body is required.");
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

  // but what if blogtitle is undefined where is this handled  --fixed
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

  // but what if blogbody is undefined where is this handled -- fixed
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
