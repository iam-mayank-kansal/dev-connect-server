import { blogModel } from "@/models/blog.model";
import { userModel } from "@/models/user.model";
import { successTemplate, failureTemplate } from "@/helper/template";
import logger from "@/helper/logger";
import type { Request, Response } from "express";

async function editBlog(req: Request, res: Response) {
  try {
    const userId = req.user!._id;
    const userNameDoc = await userModel.findById(userId).select("name -_id");
    const userName = userNameDoc?.name || "User";

    const { blogId, blogTitle, blogBody } = req.updatedContent;

    // Otherwise, update the blog
    const updatedData: any = {};
    updatedData.blogTitle = blogTitle;
    updatedData.blogBody = blogBody;

    const updatedBlog = await blogModel.findOneAndUpdate(
      { _id: blogId, userId },
      updatedData,
      { new: true }
    );

    logger.log({
      level: "info",
      message: JSON.stringify(
        successTemplate(
          200,
          `${userName}'s blog updated successfully`,
          updatedBlog
        )
      ),
      userAction: "user blog updated successfully",
    });

    return res
      .status(200)
      .json(
        successTemplate(
          200,
          `${userName}'s blog updated successfully`,
          updatedBlog
        )
      );
  } catch (error: any) {
    console.error(error.message);

    logger.log({
      level: "error",
      message: `Error in editBlog controller: ${error.message}`,
    });

    return res.status(500).json(failureTemplate(500, "Internal Server Error"));
  }
}

export default editBlog;
