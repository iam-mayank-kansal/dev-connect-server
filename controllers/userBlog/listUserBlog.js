const blogModel = require("../../models/blog");
const userModel = require("../../models/user");
const { failureTemplate, successTemplate } = require("../../helper/template");
const sendError = require("../../helper/sendError");
const logger = require("../../helper/logger");

async function listUserBlog(req, res) {
  try {
    const userId = req.user._id;
    const userName = await userModel.findById(userId).select("name -_id");

    const listUserBlogs = await blogModel
      .find({ userId: userId })
      .select("-updatedAt  -__v -_id");

    if (listUserBlogs.length === 0) {
      return sendError(res, `${userName.name} hasn't posted any blog !!`);
    }
    logger.log({
      level: "info",
      action: `${userName.name} user blogs displayed successfully`,
      message: await successTemplate(
        201,
        `${userName.name} user blogs displayed successfully`,
        listUserBlogs
      ),
    });
    res
      .status(201)
      .json(
        await successTemplate(
          201,
          `${userName.name} user blogs displayed successfully`,
          listUserBlogs
        )
      );
  } catch (error) {
    logger.log({
      level: "error",
      message: `Error in listBlog controller: ${error.message}`,
    });
    return res
      .status(500)
      .json(await failureTemplate(500, "Internal Server Error"));
  }
}

module.exports = listUserBlog;
