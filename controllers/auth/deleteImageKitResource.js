const imageKit = require("../../config/imageKit");
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

    if (!imageKit.hasImageKitEnv()) {
      return res.status(500).json({
        success: false,
        message: "ImageKit not properly configured",
      });
    }

    await imageKit.deleteFile(fileId);

    return res.status(200).json({
      success: true,
      message: "File deleted successfully",
    });
  } catch (error) {
    logger.log({
      level: "error",
      message: "Error deleting ImageKit resource",
      timestamp: new Date().toISOString(),
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack,
      },
    });

    return res.status(500).json({
      success: false,
      message: "Error deleting file",
      error: error.message,
    });
  }
}

module.exports = deleteImageKitResource;
