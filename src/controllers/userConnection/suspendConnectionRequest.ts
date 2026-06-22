import { successTemplate, failureTemplate, sendError } from "@/helper/template";
import logger from "@/helper/logger";
import { userModel } from "@/models/user.model";
import { userConnectionModel } from "@/models/userConnection.model";
import type { Request, Response } from "express";

async function suspendConnection(req: Request, res: Response) {
  try {
    const userId = req.user!._id;
    const { toUserId } = req.body;

    // Find and delete the connection request
    const deletedConnection = await userConnectionModel.findOneAndDelete({
      fromUserId: userId,
      toUserId: toUserId,
      status: "interested",
    });

    if (!deletedConnection) {
      return sendError(
        res,
        "Connection request not found or already withdrawn.",
        404
      );
    }

    // Update both users' connection arrays
    await userModel.bulkWrite([
      // Remove from current user's sent requests
      {
        updateOne: {
          filter: { _id: userId },
          update: { $pull: { "connections.requestSent": toUserId } },
        },
      },
      // Remove from recipient's received requests
      {
        updateOne: {
          filter: { _id: toUserId },
          update: { $pull: { "connections.requestReceived": userId } },
        },
      },
    ]);

    // Prepare response data
    const userConnectionData = {
      fromUserId: userId,
      toUserId: toUserId,
    };

    const message = "Connection request withdrawn successfully.";

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
      message: `Error in suspendConnection controller: ${err.message}`,
    });
    return res.status(500).json(failureTemplate(500, "Internal Server Error"));
  }
}

export default suspendConnection;
