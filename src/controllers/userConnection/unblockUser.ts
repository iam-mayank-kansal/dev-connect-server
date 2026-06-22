import { successTemplate, failureTemplate } from "@/helper/template";
import logger from "@/helper/logger";
import { userModel } from "@/models/user.model";
import { userConnectionModel } from "@/models/userConnection.model";
import type { Request, Response } from "express";

async function unblockUser(req: Request, res: Response) {
  try {
    const userId = req.user!._id;
    const { toUserId } = req.body;
    const existingConnection = req.existingConnection; // Verified by validator to exist

    // Determine which field to unset (Preserved logic)
    let unsetField: Record<string, any> = {};
    if (existingConnection.block?.user1?.equals(userId)) {
      unsetField = { "block.user1": null };
    } else if (existingConnection.block?.user2?.equals(userId)) {
      unsetField = { "block.user2": null };
    }

    const updatedConnection = await userConnectionModel.findByIdAndUpdate(
      existingConnection._id,
      { $unset: unsetField },
      { new: true }
    );

    // Check if document is empty (no blocks/ignores) -> Delete if true
    if (
      updatedConnection &&
      !updatedConnection.block?.user1 &&
      !updatedConnection.block?.user2 &&
      !updatedConnection.ignore?.user1 &&
      !updatedConnection.ignore?.user2
    ) {
      await userConnectionModel.deleteOne({ _id: updatedConnection._id });
    }

    // Update User model (Preserved logic)
    await userModel.bulkWrite([
      {
        updateOne: {
          filter: { _id: userId },
          update: { $pull: { "connections.blocked": toUserId } },
        },
      },
    ]);

    const message = "User unblocked successfully";
    const userConnectionData = { status: "unblocked", toUserId: toUserId };

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
      message: `Error in unblockUser controller: ${err.message}`,
    });
    return res.status(500).json(failureTemplate(500, "Internal Server Error"));
  }
}

export default unblockUser;
