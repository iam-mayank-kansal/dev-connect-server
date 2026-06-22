import { successTemplate, failureTemplate } from "@/helper/template";
import { messageModel } from "@/models/message.model";
import { userModel } from "@/models/user.model";
import type { Request, Response } from "express";

async function getUsersForSlider(req: Request, res: Response) {
  try {
    const userId = req.user!._id.toString();

    const messages = await messageModel.find(
      {
        $or: [{ senderId: userId }, { recieverId: userId }],
      },
      { senderId: 1, recieverId: 1 }
    );

    // Set to remove duplicates
    const engagedUserSet = new Set<string>();

    for (const msg of messages) {
      if (msg.senderId.toString() === userId) {
        engagedUserSet.add(msg.recieverId.toString());
      } else {
        engagedUserSet.add(msg.senderId.toString());
      }
    }

    const engagedUserIds = [...engagedUserSet];

    const engagedUsers = await userModel.find(
      { _id: { $in: engagedUserIds } },
      {
        name: 1,
        designation: 1,
        profilePicture: 1,
      }
    );

    res.status(200).json(
      successTemplate(200, "Engaged Users for Slider Fetched Successfully", {
        count: engagedUsers.length,
        users: engagedUsers,
      })
    );
  } catch (err: any) {
    console.error(err);
    res
      .status(500)
      .json(
        failureTemplate(
          400,
          `Error Fetching Engaged Users for Slider ${err.message}`
        )
      );
  }
}

export default getUsersForSlider;
