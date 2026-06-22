import { sendError, failureTemplate } from "@/helper/template";
import logger from "@/helper/logger";
import { userModel } from "@/models/user.model";
import validateMongoId from "@/helper/validateMongooseId";
import { userConnectionModel } from "@/models/userConnection.model";
import type { Request, Response, NextFunction } from "express";

async function blockUserValidation(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = req.user!._id;
    const { toUserId } = req.body;

    // 1. Required fields
    if (!toUserId) {
      return sendError(res, "Invalid request body. 'toUserId' is required.");
    }

    // 2. Valid Mongo ID & Self-connection check
    if (!validateMongoId(toUserId)) {
      return sendError(res, "Invalid Mongo Document ID for 'toUserId'.");
    }
    if (String(toUserId) === String(userId)) {
      return sendError(res, "Cannot block yourself.");
    }

    // 3. Target user must exist
    const existingUser = await userModel.findById(toUserId);
    if (!existingUser) {
      return sendError(res, "Target user does not exist.", 404);
    }

    // 4. Find any existing connection
    const existingConnection = await userConnectionModel.findOne({
      $or: [
        { fromUserId: userId, toUserId: toUserId },
        { fromUserId: toUserId, toUserId: userId },
      ],
    });

    // Check if user is ALREADY a blocker
    const isBlocker =
      existingConnection &&
      (existingConnection.block?.user1?.equals(userId) ||
        existingConnection.block?.user2?.equals(userId));

    if (isBlocker) {
      return sendError(res, "You have already blocked this user.");
    }

    logger.log({
      level: "info",
      message: "Block request is valid. Proceeding to controller.",
    });

    req.existingConnection = existingConnection;
    next();
  } catch (error: unknown) {
    const err = error as Error;
    logger.log({
      level: "error",
      message: `Error in blockUserValidation: ${err.message}`,
    });
    return res.status(500).json(failureTemplate(500, "Internal Server Error"));
  }
}

export default blockUserValidation;
