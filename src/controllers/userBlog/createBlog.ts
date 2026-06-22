import { blogModel } from "@/models/blog.model";
import { userModel } from "@/models/user.model";
import { successTemplate, failureTemplate } from "@/helper/template";
import logger from "@/helper/logger";
import type { Request, Response } from "express";

async function createBlog(req: Request, res: Response) {
  try {
    const userId = req.user!._id;
    const { blogTitle, blogBody, uploadedPhotos, uploadedVideos } = req.body;

    const updateData = {
      userId: userId,
      blogTitle: blogTitle ? blogTitle.trim() : "",
      blogBody: blogBody ? blogBody.trim() : "",
      blogPhoto: uploadedPhotos || [],
      blogViedo: uploadedVideos || [],
    };

    // Create the blog post
    const uploadedBlog = await blogModel.create(updateData);

    // Update the user's 'blogs' array with the new blog's ID
    await userModel.findByIdAndUpdate(userId, {
      $push: { blogs: uploadedBlog._id },
    });

    // Fetch the populated blog for the response
    const blog = await blogModel
      .findById(uploadedBlog._id)
      .select("-updatedAt -__v");

    // Log and send the response
    logger.log({
      level: "info",
      message: JSON.stringify(
        successTemplate(201, `Blog posted successfully`, blog)
      ),
      userAction: "user blog posted successfully",
    });

    return res
      .status(200)
      .json(
        successTemplate(
          201,
          `${(blog?.userId as any)?.name} user blog posted successfully`,
          blog
        )
      );
  } catch (error: any) {
    logger.log({
      level: "error",
      message: `Error in createBlog controller: ${error.message}`,
    });
    return res.status(500).json(failureTemplate(500, "Internal Server Error"));
  }
}

export default createBlog;
