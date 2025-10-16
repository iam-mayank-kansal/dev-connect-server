const sendError = require("../../helper/sendError");
const logger = require("../../helper/logger");
const blogModel = require("../../models/blog");
const validateMongoId = require("../../helper/validateMongooseId");

async function reactBlogValidation(req, res, next) {
  let { blogId, reaction } = req.body;

  // Blog ID is required
  if (!blogId) {
    return sendError(res, "Blog ID is required.");
  }

  if (!reaction) {
    return sendError(res, "req without the reaction cannot be processed");
  }
  // why not checking blog id is mongo id or not --------------------- fixed
  if (!validateMongoId(blogId)) {
    return sendError("Invalid Mongo Document ID");
  }

  // reaction validation
  reaction = reaction.toLowerCase();
  const allowedReactions = ["agree", "disagree"];

  if (!allowedReactions.includes(reaction)) {
    return sendError(res, "Only Agree and Disagree reactions are allowed");
  }

  // Check if the blog exists for this user
  const existingBlog = await blogModel.findOne({ _id: blogId });

  if (!existingBlog) {
    return sendError(res, "No blog found !!");
  }

  const updateReaction = {};

  // why checking blogid again ------------------- fixed
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
