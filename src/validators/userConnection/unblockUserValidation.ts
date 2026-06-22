import { sendError, failureTemplate } from "@/helper/template";
import logger from "@/helper/logger";
import validateMongoId from "@/helper/validateMongooseId";
import { userConnectionModel } from "@/models/userConnection.model";
import type { Request, Response, NextFunction } from "express";

async function unblockUserValidation(
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
      return sendError(res, "Cannot unblock yourself.");
    }

    // 3. Find any existing connection
    const existingConnection = await userConnectionModel.findOne({
      $or: [
        { fromUserId: userId, toUserId: toUserId },
        { fromUserId: toUserId, toUserId: userId },
      ],
    });

    if (!existingConnection) {
      return sendError(
        res,
        "Cannot unblock a user with no existing connection.",
        404
      );
    }

    // Check if user IS the blocker
    const isBlocker =
      existingConnection.block?.user1?.equals(userId) ||
      existingConnection.block?.user2?.equals(userId);

    if (!isBlocker) {
      return sendError(
        res,
        "You cannot unblock this user as you have not blocked them.",
        403
      );
    }

    logger.log({
      level: "info",
      message: "Unblock request is valid. Proceeding to controller.",
    });

    req.existingConnection = existingConnection;
    next();
  } catch (error: unknown) {
    const err = error as Error;
    logger.log({
      level: "error",
      message: `Error in unblockUserValidation: ${err.message}`,
    });
    return res.status(500).json(failureTemplate(500, "Internal Server Error"));
  }
}

export default unblockUserValidation;
