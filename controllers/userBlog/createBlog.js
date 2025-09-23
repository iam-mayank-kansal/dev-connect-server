const blogModel = require("../../models/blog");
const { successTemplate, failureTemplate } = require("../../helper/template");
const logger = require("../../helper/logger");

async function createBlog(req, res) {
  try {
    const userId = req.user._id;
    let { blogTitle, blogBody } = req.body; // extract required fields
    const reqFileData = req.files;

    const updateData = {
      userId: userId,
      blogTitle: blogTitle ? blogTitle.trim() : "",
      blogBody: blogBody ? blogBody.trim() : "",
      blogPhoto: reqFileData?.contentPhoto?.map((file) => file.filename) || [],
      blogViedo: reqFileData?.contentViedo?.map((file) => file.filename) || [],
    };

    // console.log(updateData);

    //Update User blog Document
    const uploadedBlog = await blogModel.create(updateData);
    const blog = await blogModel
      .findById(uploadedBlog._id)
      .select("-_id -updatedAt")
      .populate("userId", "name");

    // log and send the response  
    logger.log({
      level: "info",
      message: await successTemplate(
        201,
        `${blog?.userId?.name} user blog posted successfully`,
        blog
      ),
      userAction: "user blog posted successfully",
    });

    return res
      .status(200)
      .json(
        await successTemplate(
          201,
          `${blog?.userId?.name} user blog posted successfully`,
          blog
        )
      );
  } catch (error) {
    
    logger.log({
      level: "error",
      message: `Error in createBlog controller: ${error.message}`,
    });
    return res
      .status(500)
      .json(await failureTemplate(500, "Internal Server Error"));
  }
}

module.exports = createBlog;
