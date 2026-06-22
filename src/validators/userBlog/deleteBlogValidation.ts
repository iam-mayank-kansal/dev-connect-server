import { sendError, failureTemplate } from "@/helper/template";
import logger from "@/helper/logger";
import { blogModel } from "@/models/blog.model";
import type { Request, Response, NextFunction } from "express";

async function deleteBlogValidation(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = req.user!._id;
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
      message: `deleteBlogValidation validation successful`,
    });

    // Attach validated update object to request
    req.existingBlog = existingBlog;
    next();
  } catch (error: unknown) {
    const err = error as Error;
    logger.log({
      level: "error",
      message: `Error in deleteBlogValidation: ${err.message}`,
    });
    return res.status(500).json(failureTemplate(500, "Internal Server Error"));
  }
}

export default deleteBlogValidation;
