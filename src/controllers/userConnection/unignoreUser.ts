import { successTemplate, failureTemplate } from "@/helper/template";
import logger from "@/helper/logger";
import { userModel } from "@/models/user.model";
import { userConnectionModel } from "@/models/userConnection.model";
import type { Request, Response } from "express";

async function unignoreUser(req: Request, res: Response) {
  try {
    const userId = req.user!._id;
    const { toUserId } = req.body;
    const existingConnection = req.existingConnection; // Verified by validator

    const unsetObj: Record<string, any> = {};
    if (existingConnection.ignore?.user1?.equals(userId)) {
      unsetObj["ignore.user1"] = 1;
    }
    if (existingConnection.ignore?.user2?.equals(userId)) {
      unsetObj["ignore.user2"] = 1;
    }

    // Remove the current user's ID from the ignore sub-document
    const updatedConnection = await userConnectionModel.findByIdAndUpdate(
      existingConnection._id,
      {
        $unset: unsetObj,
      },
      { new: true }
    );

    // If both block and ignore sub-documents are empty, delete the entire connection
    if (
      updatedConnection &&
      !updatedConnection.block?.user1 &&
      !updatedConnection.block?.user2 &&
      !updatedConnection.ignore?.user1 &&
      !updatedConnection.ignore?.user2
    ) {
      await userConnectionModel.deleteOne({ _id: updatedConnection._id });
    }

    // Update the user model by pulling from the 'ignored' list
    await userModel.bulkWrite([
      {
        updateOne: {
          filter: { _id: userId },
          update: { $pull: { "connections.ignored": toUserId } },
        },
      },
    ]);

    const message = "User unignored successfully";
    const userConnectionData = { status: "unignored", toUserId: toUserId };

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
      message: `Error in unignoreUser controller: ${err.message}`,
    });
    return res.status(500).json(failureTemplate(500, "Internal Server Error"));
  }
}

export default unignoreUser;
