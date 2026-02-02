const logger = require("../../helper/logger");
const { sendError } = require("../../helper/template");
const blogModel = require("../../models/blog");

async function createBlogValidation(req, res, next) {
  const userId = req.user._id;
  const { blogTitle, blogBody, uploadedPhotos, uploadedVideos } = req.body;

  // Required fields
  if (!blogTitle || !blogBody) {
    return sendError(res, "Invalid request body");
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

  // Limit for a user to post content -- limit -- 50
  const MAX_BLOGS_PER_USER = 50;
  const checkDuplicateBlog = await blogModel.countDocuments({ userId: userId });

  if (checkDuplicateBlog >= MAX_BLOGS_PER_USER) {
    return sendError(
      res,
      `You have reached the maximum limit of ${MAX_BLOGS_PER_USER} blogs. You cannot upload more until you delete some existing ones.`
    );
  }

  // Validate uploaded photos and videos from frontend
  if (uploadedPhotos) {
    if (!Array.isArray(uploadedPhotos)) {
      return sendError(res, "uploadedPhotos must be an array");
    }
    if (uploadedPhotos.length > 10) {
      return sendError(res, "Maximum 10 photos allowed");
    }
    for (const photo of uploadedPhotos) {
      if (!photo.url || !photo.fileId) {
        return sendError(res, "Each photo must have url and fileId");
      }
      if (typeof photo.url !== "string" || typeof photo.fileId !== "string") {
        return sendError(res, "Photo url and fileId must be strings");
      }
    }
  }

  if (uploadedVideos) {
    if (!Array.isArray(uploadedVideos)) {
      return sendError(res, "uploadedVideos must be an array");
    }
    if (uploadedVideos.length > 2) {
      return sendError(res, "Maximum 2 videos allowed");
    }
    for (const video of uploadedVideos) {
      if (!video.url || !video.fileId) {
        return sendError(res, "Each video must have url and fileId");
      }
      if (typeof video.url !== "string" || typeof video.fileId !== "string") {
        return sendError(res, "Video url and fileId must be strings");
      }
    }
  }

  logger.log({
    level: "info",
    message: `User create blog validation successful`,
  });
  next();
}

module.exports = createBlogValidation;
