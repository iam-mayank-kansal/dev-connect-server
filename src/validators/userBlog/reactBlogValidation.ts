import { sendError, failureTemplate } from "@/helper/template";
import logger from "@/helper/logger";
import { blogModel } from "@/models/blog.model";
import validateMongoId from "@/helper/validateMongooseId";
import type { Request, Response, NextFunction } from "express";

async function reactBlogValidation(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
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
    reaction = (reaction as string).toLowerCase();
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

    const updateReaction: Record<string, any> = {};
    updateReaction.blogId = blogId;
    updateReaction.reaction = reaction;

    logger.log({
      level: "info",
      message: `reactBlogValidation validation successful`,
    });

    // Attach validated update object to request
    req.updateReaction = updateReaction;

    next();
  } catch (error: unknown) {
    const err = error as Error;
    logger.log({
      level: "error",
      message: `Error in reactBlogValidation: ${err.message}`,
    });
    return res.status(500).json(failureTemplate(500, "Internal Server Error"));
  }
}

export default reactBlogValidation;
