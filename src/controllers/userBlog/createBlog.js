const blogModel = require("../../models/blog");
const userModel = require("../../models/user");
const { successTemplate, failureTemplate } = require("../../helper/template");
const logger = require("../../helper/logger");

async function createBlog(req, res) {
  try {
    const userId = req.user._id;
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
      message: successTemplate(201, `Blog posted successfully`, blog),
      userAction: "user blog posted successfully",
    });

    return res
      .status(200)
      .json(
        successTemplate(
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
    return res.status(500).json(failureTemplate(500, "Internal Server Error"));
  }
}

module.exports = createBlog;
