import { blogModel } from "@/models/blog.model";
import { userModel } from "@/models/user.model";
import { successTemplate, failureTemplate } from "@/helper/template";
import logger from "@/helper/logger";
import type { Request, Response } from "express";

async function deleteBlog(req: Request, res: Response) {
  try {
    const existingBlog = req.existingBlog;
    const userNameDoc = await userModel
      .findById(existingBlog.userId)
      .select("name -_id");
    const userName = userNameDoc?.name || "User";

    const deleteUserBlog = await blogModel.findByIdAndDelete(existingBlog._id);

    logger.log({
      level: "info",
      message: JSON.stringify(
        successTemplate(200, `${userName}'s blog deleted successfully`)
      ),
      userAction: "user blog deleted successfully",
      deleteUserBlog,
    });

    return res
      .status(200)
      .json(
        successTemplate(
          200,
          `${userName}'s blog deleted successfully`,
          deleteUserBlog
        )
      );
  } catch (error: any) {
    console.error(error.message);

    logger.log({
      level: "error",
      message: `Error in deleteBlog controller: ${error.message}`,
    });

    return res.status(500).json(failureTemplate(500, "Internal Server Error"));
  }
}

export default deleteBlog;
