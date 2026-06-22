import { successTemplate, failureTemplate } from "@/helper/template";
import logger from "@/helper/logger";
import { userModel } from "@/models/user.model";
import { userConnectionModel } from "@/models/userConnection.model";
import type { Request, Response } from "express";

async function sendConnection(req: Request, res: Response) {
  try {
    const userId = req.user!._id;
    const { toUserId } = req.body;

    // The validator has already confirmed that no connection exists.
    // So we can safely create a new one.
    const newConnection = await userConnectionModel.create({
      fromUserId: userId,
      toUserId: toUserId,
      status: "interested",
    });

    // Update the user models to reflect the new request
    await userModel.bulkWrite([
      // Add the toUserId to the current user's 'sent' connections list
      {
        updateOne: {
          filter: { _id: userId },
          update: { $addToSet: { "connections.requestSent": toUserId } },
        },
      },
      // Add the userId to the recipient's 'received' connections list
      {
        updateOne: {
          filter: { _id: toUserId },
          update: { $addToSet: { "connections.requestReceived": userId } },
        },
      },
    ]);

    // Prepare response data for clarity using populate
    const populatedConnection = await userConnectionModel
      .findById(newConnection._id)
      .populate("toUserId", "name _id designation email profilePicture")
      .lean();

    const toUserData = populatedConnection?.toUserId || "";

    const userConnectionData = {
      toUserData,
      status: "interested",
    };

    const message = "Connection request sent successfully.";

    // Log and send the success response
    logger.log({
      level: "info",
      message: JSON.stringify(successTemplate(201, message)),
      data: userConnectionData,
    });

    return res
      .status(201)
      .json(successTemplate(201, message, userConnectionData));
  } catch (error: unknown) {
    const err = error as Error;
    logger.log({
      level: "error",
      message: `Error in sendConnection controller: ${err.message}`,
    });
    return res.status(500).json(failureTemplate(500, "Internal Server Error"));
  }
}

export default sendConnection;
