const blogModel = require("../../models/blog");
const userModel = require("../../models/user");
const { successTemplate, failureTemplate } = require("../../helper/template");
const logger = require("../../helper/logger");

async function deleteBlog(req, res) {
  try {
    const existingBlog = req.existingBlog;
    const userNameDoc = await userModel
      .findById(existingBlog.userId)
      .select("name -_id");
    const userName = userNameDoc?.name || "User";

    const deleteUserBlog = await blogModel.findByIdAndDelete(existingBlog._id);

    logger.log({
      level: "info",
      message: await successTemplate(
        200,
        `${userName}'s blog deleted successfully`
      ),
      userAction: "user blog deleted successfully",
      deleteUserBlog,
    });

    return res
      .status(200)
      .json(
        await successTemplate(
          200,
          `${userName}'s blog deleted successfully`,
          deleteUserBlog
        )
      );
  } catch (error) {
    console.error(error.message);

    logger.log({
      level: "error",
      message: `Error in deleteBlog controller: ${error.message}`,
    });

    return res
      .status(500)
      .json(await failureTemplate(500, "Internal Server Error"));
  }
}

module.exports = deleteBlog;
