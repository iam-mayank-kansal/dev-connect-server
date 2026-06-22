import { blogModel } from "@/models/blog.model";
import { successTemplate, failureTemplate, sendError } from "@/helper/template";
import logger from "@/helper/logger";
import validateMongoId from "@/helper/validateMongooseId";
import type { Request, Response } from "express";

async function fetchBlogById(req: Request, res: Response) {
  try {
    const { blogId } = req.params;

    // Validate blogId
    if (!blogId || Array.isArray(blogId) || !validateMongoId(blogId)) {
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
      message: JSON.stringify(
        successTemplate(200, `Blog fetched successfully`, blog)
      ),
    });

    res
      .status(200)
      .json(successTemplate(200, `Blog fetched successfully`, blog));
  } catch (error: unknown) {
    const err = error as Error;
    logger.log({
      level: "error",
      message: `Error in fetchBlogById controller: ${err.message}`,
    });
    return res.status(500).json(failureTemplate(500, "Internal Server Error"));
  }
}

export default fetchBlogById;
