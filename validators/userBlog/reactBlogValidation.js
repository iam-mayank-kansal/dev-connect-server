const sendError = require("../../helper/sendError");
const logger = require("../../helper/logger");
const blogModel = require("../../models/blog");

async function reactBlogValidation(req, res, next) {
  let { blogId, reaction } = req.body;

  // Blog ID is required
  if (!blogId) {
    return sendError(res, "Blog ID is required.");
  }

  // reaction validation
  reaction = reaction.toLowerCase();
  const allowedReactions=["like","agree","disagree"]
  
  if(!allowedReactions.includes(reaction)) {
    return sendError(res,"Only Like , Agree , Disagree reactions are allowed")
  }

  // Check if the blog exists for this user
  const existingBlog = await blogModel.findOne({_id: blogId });

  if (!existingBlog) {
    return sendError(res, "No blog found !!");
  }

  const updateReaction = {};
  if (blogId !== undefined) updateReaction.blogId = blogId;
  if (reaction !== undefined) updateReaction.reaction = reaction;
  
  
  // If nothing to update
  if (Object.keys(updateReaction).length === 0) {
    return sendError(res, "No fields to update.");
  }
 
  
  logger.log({
    level: "info",
    message: `reactBlogValidation validation successful`,
  });

  // Attach validated update object to request
  req.updateReaction = updateReaction;
  
  next();
}

module.exports = reactBlogValidation;
