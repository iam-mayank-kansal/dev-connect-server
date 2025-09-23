const sendError = require("../../helper/sendError");
const logger = require("../../helper/logger");
const blogModel = require("../../models/blog");

async function updateUserValidation(req, res, next) {
  const userId = req.user._id;
  const { blogTitle, blogBody } = req.body; // extract required fields
  const reqFileData = req.files;

  const contentPhotos = reqFileData?.contentPhoto || [];
  const contentVideos = reqFileData?.contentViedo || [];

  // required fields
  if (!blogTitle || !blogBody) {
    return sendError(res, "Invalid request body");
  }

  if (contentPhotos.length === 0 && contentVideos.length === 0) {
    return sendError(res, "At least one image or video is required");
  }
  // Type check
  if (typeof blogTitle !== "string" || typeof blogBody !== "string") {
    return sendError(res, "blogTitle and blogBody must be strings");
  }

  // Trim spaces
  const title = blogTitle.trim();
  const body = blogBody.trim();

  // Length validation
  if (title.length === 0) {
    return sendError(res, "blogTitle cannot be empty");
  }
  if (title.length > 200) {
    return sendError(res, "blogTitle cannot exceed 200 characters");
  }

  if (body.length === 0) {
    return sendError(res, "blogBody cannot be empty");
  }
  if (body.length > 10000) {
    return sendError(res, "blogBody cannot exceed 10000 characters");
  }

  // limit for a user to post content -- limit -- 50
  const MAX_BLOGS_PER_USER = 20;
  const checkDuplicateBlog = await blogModel.countDocuments({ userId: userId });
  
  if (checkDuplicateBlog >= MAX_BLOGS_PER_USER) {
    return sendError(
      res,
      `You have reached the maximum limit of ${MAX_BLOGS_PER_USER} blogs. You cannot upload more until you delete some existing ones.`
    );
  }

  //   // File Uploads
  if (reqFileData) {
    const contentPhotos = reqFileData?.contentPhoto || [];
    const contentVideos = reqFileData?.contentViedo || [];

    // 1️⃣ Validate images
    const MAX_IMAGE_SIZE = 2 * 1024 * 1024; // 2 MB
    for (const file of contentPhotos) {
      if (!file.mimetype.startsWith("image/")) {
        return sendError(res, "Only image files are allowed for contentPhoto");
      }
      if (file.size > MAX_IMAGE_SIZE) {
        return sendError(
          res,
          `Each contentPhoto cannot exceed ${MAX_IMAGE_SIZE / 1024 / 1024} MB`
        );
      }
    }

    // 2️⃣ Validate videos
    const MAX_VIDEO_SIZE = 70 * 1024 * 1024; // 10 MB
    for (const file of contentVideos) {
      if (!file.mimetype.startsWith("video/")) {
        return sendError(res, "Only video files are allowed for contentViedo");
      }
      if (file.size > MAX_VIDEO_SIZE) {
        return sendError(
          res,
          `Each contentViedo cannot exceed ${MAX_VIDEO_SIZE / 1024 / 1024} MB`
        );
      }
    }
  }

  logger.log({
    level: "info",
    message: `User create post Validation Successful`,
  });
  next();
}

module.exports = updateUserValidation;
