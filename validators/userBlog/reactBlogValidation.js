const { sendError } = require("../../helper/template");
const logger = require("../../helper/logger");
const blogModel = require("../../models/blog");
const validateMongoId = require("../../helper/validateMongooseId");

async function reactBlogValidation(req, res, next) {
  let { blogId, reaction } = req.body;

  // Blog ID is required
  if (!blogId) {
    return sendError(res, "Blog ID is required.");
  }

  // CHANGE: Check if reaction is undefined, allowing an empty string.
  if (reaction === undefined) {
    return sendError(res, "req without the reaction cannot be processed");
  }

  if (!validateMongoId(blogId)) {
    return sendError(res, "Invalid Mongo Document ID");
  }

  // reaction validation
  reaction = reaction.toLowerCase();
  // CHANGE: Add empty string to the list of allowed reactions.
  const allowedReactions = ["agree", "disagree", ""];

  if (!allowedReactions.includes(reaction)) {
    return sendError(res, "Only Agree and Disagree reactions are allowed");
  }

  // Check if the blog exists for this user
  const existingBlog = await blogModel.findOne({ _id: blogId });

  if (!existingBlog) {
    return sendError(res, "No blog found !!");
  }

  const updateReaction = {};
  updateReaction.blogId = blogId;
  updateReaction.reaction = reaction;

  logger.log({
    level: "info",
    message: `reactBlogValidation validation successful`,
  });

  // Attach validated update object to request
  req.updateReaction = updateReaction;

  next();
}

module.exports = reactBlogValidation;
