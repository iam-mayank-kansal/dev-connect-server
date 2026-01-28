const imagekit = require("../../config/imageKit");
const logger = require("../../helper/logger");

async function deleteImageKitResource(req, res) {
  try {
    const { fileId } = req.body;

    if (!fileId) {
      return res.status(400).json({
        success: false,
        message: "File ID is required",
      });
    }

    // Delete the file from ImageKit
    await imagekit.deleteFile(fileId);

    return res.status(200).json({
      success: true,
      message: "File deleted successfully",
    });
  } catch (error) {
    logger.error("Error deleting ImageKit resource:", error);
    return res.status(500).json({
      success: false,
      message: "Error deleting file",
      error: error.message,
    });
  }
}

module.exports = deleteImageKitResource;
