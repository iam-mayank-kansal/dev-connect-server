const imageKit = require("../../config/imageKit");
const { successTemplate, failureTemplate } = require("../../helper/template");
const logger = require("../../helper/logger");

async function getImageKitAuth(req, res) {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json(failureTemplate(401, "Unauthorized"));
    }

    if (!imageKit.hasImageKitEnv()) {
      logger.log({
        level: "error",
        message: "ImageKit environment variables missing",
        timestamp: new Date().toISOString(),
        hasPublicKey: !!process.env.IMAGEKIT_PUBLIC_KEY,
        hasPrivateKey: !!process.env.IMAGEKIT_PRIVATE_KEY,
        hasUrlEndpoint: !!process.env.IMAGEKIT_URL_ENDPOINT,
      });
      return res
        .status(500)
        .json(failureTemplate(500, "ImageKit not properly configured"));
    }

    logger.log({
      level: "info",
      message: "ImageKit client is ready",
      timestamp: new Date().toISOString(),
      imageKitType: typeof imageKit.client,
      hasGetAuthMethod: typeof imageKit.getAuthenticationParameters,
    });

    // Generate auth parameters with 30 minute expiration
    const expireTime = Math.floor(Date.now() / 1000) + 30 * 60; // 30 minutes from now
    const authParams = imageKit.getAuthenticationParameters({
      expire: expireTime,
    });

    if (!authParams?.token || !authParams?.expire || !authParams?.signature) {
      throw new Error("ImageKit auth helper returned incomplete parameters");
    }

    logger.log({
      level: "info",
      message: "ImageKit auth params generated successfully",
      timestamp: new Date().toISOString(),
      paramsKeys: Object.keys(authParams),
    });

    return res
      .status(200)
      .json(successTemplate(200, "ImageKit auth params retrieved", authParams));
  } catch (error) {
    logger.log({
      level: "error",
      message: "Error getting ImageKit authentication parameters",
      timestamp: new Date().toISOString(),
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack,
      },
    });

    return res
      .status(500)
      .json(
        failureTemplate(
          500,
          "Failed to get ImageKit auth parameters",
          error.message
        )
      );
  }
}

module.exports = getImageKitAuth;
