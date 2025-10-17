const blogModel = require("../../models/blog");
const { failureTemplate, successTemplate } = require("../../helper/template");
const { sendError } = require("../../helper/template");
const logger = require("../../helper/logger");

async function listAllBlog(req, res) {
  try {
    const listAllBlog = await blogModel
      .find({})
      .select("-updatedAt  -__v -_id")
      .populate("userId", "name designation profilePicture");

    if (listAllBlog.length === 0) {
      return sendError(res, "no blogs are present");
    }
    logger.log({
      level: "info",
      action: `All user blogs displayed successfully`,
      message: await successTemplate(
        201,
        `All user blogs displayed successfully`,
        listAllBlog
      ),
    });
    res
      .status(201)
      .json(
        await successTemplate(
          201,
          `All user blogs displayed successfully`,
          listAllBlog
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

module.exports = listAllBlog;
