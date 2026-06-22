import { successTemplate, failureTemplate } from "@/helper/template";
import logger from "@/helper/logger";
import { userModel } from "@/models/user.model";
import { userConnectionModel } from "@/models/userConnection.model";
import type { Request, Response } from "express";

async function blockUser(req: Request, res: Response) {
  try {
    const userId = req.user!._id;
    const { toUserId } = req.body;
    const existingConnection = req.existingConnection;

    if (existingConnection) {
      let updateFields: Record<string, any> = {};

      if (!existingConnection.block?.user1) {
        updateFields["block.user1"] = userId;
      } else if (!existingConnection.block?.user2) {
        updateFields["block.user2"] = userId;
      } else {
        return res
          .status(400)
          .json(failureTemplate(400, "You have already blocked this user."));
      }

      updateFields["status"] = "none";

      await userConnectionModel.updateOne(
        { _id: existingConnection._id },
        { $set: updateFields }
      );
    } else {
      await userConnectionModel.create({
        fromUserId: userId,
        toUserId: toUserId,
        status: "none",
        block: { user1: userId, user2: null },
      });
    }

    await userModel.bulkWrite([
      {
        updateOne: {
          filter: { _id: userId },
          update: {
            $addToSet: { "connections.blocked": toUserId },
            $pull: {
              "connections.connected": toUserId,
              "connections.requestReceived": toUserId,
              "connections.requestSent": toUserId,
              "connections.ignored": toUserId,
            },
          },
        },
      },
      {
        updateOne: {
          filter: { _id: toUserId },
          update: {
            $pull: {
              "connections.connected": userId,
              "connections.requestReceived": userId,
              "connections.requestSent": userId,
              "connections.ignored": userId,
            },
          },
        },
      },
    ]);

    const blockedUserData = await userModel
      .findById(toUserId)
      .select("name designation email profilePicture _id")
      .lean();

    const message = "User blocked successfully";

    const responseData = {
      status: "blocked",
      blockedUser: blockedUserData,
    };

    logger.log({
      level: "info",
      message: JSON.stringify(successTemplate(200, message)),
      data: responseData,
    });
    return res.status(200).json(successTemplate(200, message, responseData));
  } catch (error: unknown) {
    const err = error as Error;
    logger.log({
      level: "error",
      message: `Error in blockUser controller: ${err.message}`,
    });
    return res.status(500).json(failureTemplate(500, "Internal Server Error"));
  }
}

export default blockUser;
