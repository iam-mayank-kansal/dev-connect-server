import {
  getAuthenticationParameters,
  hasImageKitEnv,
  imageKitClient,
} from "@/config/imageKit";
import logger from "@/helper/logger";
import { successTemplate, failureTemplate } from "@/helper/template";
import type { Request, Response } from "express";

async function getImageKitAuth(req: Request, res: Response) {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json(failureTemplate(401, "Unauthorized"));
    }

    if (!hasImageKitEnv()) {
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
      imageKitType: typeof imageKitClient,
      hasGetAuthMethod: typeof getAuthenticationParameters,
    });

    // Generate auth parameters with 30 minute expiration
    const expireTime = Math.floor(Date.now() / 1000) + 30 * 60; // 30 minutes from now
    const authParams = getAuthenticationParameters({
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
  } catch (error: any) {
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
          error?.message || "Failed to get ImageKit auth parameters"
        )
      );
  }
}

export default getImageKitAuth;
