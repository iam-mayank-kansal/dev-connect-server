import { successTemplate, failureTemplate, sendError } from "@/helper/template";
import logger from "@/helper/logger";
import { userModel } from "@/models/user.model";
import { userConnectionModel } from "@/models/userConnection.model";
import type { Request, Response } from "express";

async function deleteConnection(req: Request, res: Response) {
  try {
    const userId = req.user!._id;
    const { toUserId } = req.body;

    // Find and delete the connection
    const deletedConnection = await userConnectionModel.findOneAndDelete({
      $or: [
        { fromUserId: userId, toUserId: toUserId, status: "accepted" },
        { fromUserId: toUserId, toUserId: userId, status: "accepted" },
      ],
    });

    if (!deletedConnection) {
      return sendError(res, "Connection not found or already deleted.", 404);
    }

    // Update both users' connection arrays
    await userModel.bulkWrite([
      // Remove from current user's connections
      {
        updateOne: {
          filter: { _id: userId },
          update: {
            $pull: {
              "connections.connected": toUserId,
              "connections.requestSent": toUserId,
              "connections.requestReceived": toUserId,
            },
          },
        },
      },
      // Remove from other user's connections
      {
        updateOne: {
          filter: { _id: toUserId },
          update: {
            $pull: {
              "connections.connected": userId,
              "connections.requestSent": userId,
              "connections.requestReceived": userId,
            },
          },
        },
      },
    ]);

    // Prepare response data
    const userConnectionData = {
      fromUserId: userId,
      toUserId: toUserId,
      action: "deleted",
    };

    const message = "Connection deleted successfully.";

    // Log and send the success response
    logger.log({
      level: "info",
      message: JSON.stringify(successTemplate(200, message)),
      data: userConnectionData,
    });

    return res
      .status(200)
      .json(successTemplate(200, message, userConnectionData));
  } catch (error: unknown) {
    const err = error as Error;
    logger.log({
      level: "error",
      message: `Error in deleteConnection controller: ${err.message}`,
    });
    return res.status(500).json(failureTemplate(500, "Internal Server Error"));
  }
}

export default deleteConnection;
