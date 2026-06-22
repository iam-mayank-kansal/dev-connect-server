import { successTemplate, failureTemplate } from "@/helper/template";
import logger from "@/helper/logger";
import { userModel } from "@/models/user.model";
import { userConnectionModel } from "@/models/userConnection.model";
import type { Request, Response } from "express";

async function connectionResponse(req: Request, res: Response) {
  try {
    const userId = req.user!._id;
    const { fromUserId, status } = req.body;
    const normalizedStatus = (status as string).toLowerCase();

    // The validator has already attached the pending connection document.
    const pendingConnection = req.pendingConnection;

    let message = "";

    // 1. Handle the 'accepted' status
    if (normalizedStatus === "accepted") {
      // Update the main connection document's status
      await userConnectionModel.updateOne(
        { _id: pendingConnection._id },
        { $set: { status: "accepted" } }
      );

      // Update the user models to add each user to the other's 'connected' list
      await userModel.bulkWrite([
        {
          updateOne: {
            filter: { _id: fromUserId },
            update: {
              $pull: { "connections.requestSent": userId }, // Remove from sent list
              $addToSet: { "connections.connected": userId }, // Add to connected list
            },
          },
        },
        {
          updateOne: {
            filter: { _id: userId },
            update: {
              $pull: {
                "connections.requestReceived": fromUserId, // Remove from received list
                "connections.ignored": fromUserId, // Corrected: Also remove from ignored list
              },
              $addToSet: { "connections.connected": fromUserId }, // Add to connected list
            },
          },
        },
      ]);
      message = "Connection request accepted successfully";
    }

    // 2. Handle the 'rejected' status
    else if (normalizedStatus === "rejected") {
      // For a rejection, delete the pending connection document
      await userConnectionModel.deleteOne({ _id: pendingConnection._id });

      // Update the user models to remove the sent/received request entries
      await userModel.bulkWrite([
        {
          updateOne: {
            filter: { _id: fromUserId },
            update: { $pull: { "connections.requestSent": userId } },
          },
        },
        {
          updateOne: {
            filter: { _id: userId },
            update: {
              $pull: {
                "connections.requestReceived": fromUserId,
                "connections.ignored": fromUserId,
              },
            },
          },
        },
      ]);
      message = "Connection request rejected successfully";
    }

    const userConnectionData = {
      fromUserId: fromUserId,
      toUserId: userId,
      status: normalizedStatus,
    };

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
      message: `Error in connectionResponse controller: ${err.message}`,
    });
    return res.status(500).json(failureTemplate(500, "Internal Server Error"));
  }
}

export default connectionResponse;
