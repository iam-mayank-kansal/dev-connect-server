import { deleteImageKitFile, hasImageKitEnv } from "@/config/imageKit";
import logger from "@/helper/logger";
import type { Request, Response } from "express";
import { successTemplate, failureTemplate } from "@/helper/template";

async function deleteImageKitResource(req: Request, res: Response) {
  try {
    const { fileId } = req.body;

    if (!fileId) {
      return res.status(400).json({
        success: false,
        message: "File ID is required",
      });
    }

    if (!hasImageKitEnv()) {
      return res.status(500).json({
        success: false,
        message: "ImageKit not properly configured",
      });
    }

    await deleteImageKitFile(fileId);

    return res.status(200).json({
      success: true,
      message: "File deleted successfully",
    });
  } catch (error: any) {
    logger.log({
      level: "error",
      message: "Error deleting ImageKit resource",
      timestamp: new Date().toISOString(),
      error: {
        name: error?.name,
        message: error?.message,
        stack: error?.stack,
      },
    });

    return res.status(500).json({
      success: false,
      message: "Error deleting file",
      error: error?.message,
    });
  }
}

export default deleteImageKitResource;
