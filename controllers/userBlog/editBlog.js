const blogModel = require("../../models/blog");
const userModel = require("../../models/user");
const { successTemplate, failureTemplate } = require("../../helper/template");
const logger = require("../../helper/logger");

async function editBlog(req, res) {
  try {
    const userId = req.user._id;
    const userNameDoc = await userModel.findById(userId).select("name -_id");
    const userName = userNameDoc?.name || "User";

    const { blogId, blogTitle, blogBody } = req.updatedContent;

    // Otherwise, update the blog
    const updatedData = {};
    updatedData.blogTitle = blogTitle;
    updatedData.blogBody = blogBody;

    const updatedBlog = await blogModel.findOneAndUpdate(
      { _id: blogId, userId },
      updatedData,
      { new: true }
    );

    logger.log({
      level: "info",
      message: await successTemplate(
        200,
        `${userName}'s blog updated successfully`,
        updatedBlog
      ),
      userAction: "user blog updated successfully",
    });

    return res
      .status(200)
      .json(
        await successTemplate(
          200,
          `${userName}'s blog updated successfully`,
          updatedBlog
        )
      );
  } catch (error) {
    console.error(error.message);

    logger.log({
      level: "error",
      message: `Error in editBlog controller: ${error.message}`,
    });

    return res
      .status(500)
      .json(await failureTemplate(500, "Internal Server Error"));
  }
}

module.exports = editBlog;
