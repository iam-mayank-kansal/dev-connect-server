import { blogModel } from "@/models/blog.model";
import { userModel } from "@/models/user.model";
import { successTemplate, failureTemplate, sendError } from "@/helper/template";
import logger from "@/helper/logger";
import validateMongoId from "@/helper/validateMongooseId";
import type { Request, Response } from "express";

async function fetchUserBlogs(req: Request, res: Response) {
  try {
    const { userId } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    // Validate userId
    if (!userId || Array.isArray(userId) || !validateMongoId(userId)) {
      return sendError(res, "Invalid user ID");
    }

    // Check if user exists
    const user = await userModel.findById(userId).select("name");
    if (!user) {
      return sendError(res, "User not found");
    }

    const blogs = await blogModel
      .find({ userId: userId })
      .select("-updatedAt -__v")
      .populate("userId", "name designation profilePicture")
      .sort({ createdAt: -1 as any })
      .skip(skip)
      .limit(limit);

    const totalCount = await blogModel.countDocuments({ userId: userId });
    const totalPages = Math.ceil(totalCount / limit);

    logger.log({
      level: "info",
      action: `${user.name} blogs fetched with pagination (page ${page}, limit ${limit})`,
      message: `Fetched ${blogs.length} blogs for user`,
      totalCount,
      timestamp: new Date().toISOString(),
    });

    res.status(200).json(
      successTemplate(
        200,
        blogs.length === 0
          ? `${user.name} hasn't posted any blogs yet`
          : `${user.name} blogs fetched successfully`,
        {
          blogs,
          pagination: {
            currentPage: page,
            limit,
            totalCount,
            totalPages,
          },
        }
      )
    );
  } catch (error: any) {
    logger.log({
      level: "error",
      message: `Error in fetchUserBlogs controller: ${error.message}`,
    });
    return res.status(500).json(failureTemplate(500, "Internal Server Error"));
  }
}

export default fetchUserBlogs;
