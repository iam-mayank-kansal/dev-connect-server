import { successTemplate, failureTemplate } from "@/helper/template";
import { messageModel } from "@/models/message.model";
import { ioServer, getSocketIdByUserId } from "@/socket";
import type { Request, Response } from "express";

async function sendMessage(req: Request, res: Response) {
  try {
    const { id: otherUserId } = req.params as { id: string };

    const userId = req.user!._id.toString();

    const { text, image } = req.body;

    const newMessage = new messageModel({
      senderId: userId,
      recieverId: otherUserId,
      text: text,
      image: image,
    });

    await newMessage.save();

    const resposeData = {
      _id: newMessage?._id,
      senderId: newMessage?.senderId,
      recieverId: newMessage?.recieverId,
      image: newMessage?.image,
      text: newMessage?.text,
      createdAt: newMessage?.createdAt,
      isRead: newMessage?.isRead,
      readAt: newMessage?.readAt,
    };

    const receiverSocketId = getSocketIdByUserId(otherUserId);
    if (receiverSocketId) {
      ioServer.to(receiverSocketId).emit("newMessage", resposeData);
    }

    const response = successTemplate(
      200,
      `Message Send Successfully to user : ${otherUserId}`,
      resposeData
    );

    res.json(response);
  } catch (err: any) {
    console.error(err);
    res.json(failureTemplate(400, `Error Sending Message : ${err.message}`));
  }
}

export default sendMessage;
