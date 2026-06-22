import { blogModel } from "@/models/blog.model";
import { userModel } from "@/models/user.model";
import { successTemplate, failureTemplate } from "@/helper/template";
import logger from "@/helper/logger";
import type { Request, Response } from "express";

async function fetchBlogs(req: Request, res: Response) {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    // Build query to exclude blocked and ignored users
    const query: any = {};
    if (req.user?._id) {
      const currentUserId = req.user._id;
      // Fetch fresh user data from database to get latest blocked/ignored lists
      const currentUser = await userModel
        .findById(currentUserId)
        .select("connections");
      const blockedByMe = currentUser?.connections?.blocked || [];
      const ignoredByMe = currentUser?.connections?.ignored || [];

      // Exclude blogs from users I blocked or ignored
      query.userId = { $nin: [...blockedByMe, ...ignoredByMe] };
    }

    let blogs = await blogModel
      .find(query)
      .select("-updatedAt -__v")
      .populate("userId", "name designation profilePicture connections")
      .sort({ createdAt: -1 as any })
      .skip(skip)
      .limit(limit);

    // Filter out blogs from users who blocked the current user
    if (req.user?._id) {
      const currentUserId = req.user._id;
      blogs = blogs.filter((blog) => {
        if (!blog.userId) return true; // Skip if user not found
        const blogUserBlockedList =
          (blog.userId as any).connections?.blocked || [];
        return !blogUserBlockedList.some(
          (blockedId: any) => blockedId.toString() === currentUserId.toString()
        );
      });
    }

    const totalCount = await blogModel.countDocuments(query);
    const totalPages = Math.ceil(totalCount / limit);

    logger.log({
      level: "info",
      action: `Blogs fetched with pagination (page ${page}, limit ${limit})`,
      message: JSON.stringify(
        successTemplate(200, `Blogs fetched successfully`, {
          blogs,
          pagination: {
            currentPage: page,
            limit,
            totalCount,
            totalPages,
          },
        })
      ),
    });

    res.status(200).json(
      successTemplate(200, `Blogs fetched successfully`, {
        blogs,
        pagination: {
          currentPage: page,
          limit,
          totalCount,
          totalPages,
        },
      })
    );
  } catch (error: any) {
    logger.log({
      level: "error",
      message: `Error in fetchBlogs controller: ${error.message}`,
    });
    return res.status(500).json(failureTemplate(500, "Internal Server Error"));
  }
}

export default fetchBlogs;
