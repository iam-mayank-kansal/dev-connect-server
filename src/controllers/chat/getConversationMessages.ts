import { successTemplate, failureTemplate } from "@/helper/template";
import { messageModel } from "@/models/message.model";
import type { Request, Response } from "express";

async function getConversationMessages(req: Request, res: Response) {
  try {
    const { id: otherUserId } = req.params;
    const userId = req.user!._id.toString();

    const messages = await messageModel
      .find(
        {
          $or: [
            { senderId: userId, recieverId: otherUserId },
            { senderId: otherUserId, recieverId: userId },
          ],
        },
        { __v: 0 }
      )
      .lean();

    res.json(
      successTemplate(
        200,
        `Message Send Successfully to user : ${otherUserId}`,
        messages
      )
    );
  } catch (err: any) {
    console.error(err);
    res.json(
      failureTemplate(400, `Error Fetching Conversation : ${err.message}`)
    );
  }
}

export default getConversationMessages;
