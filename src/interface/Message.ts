import { Types } from "mongoose";

export interface IMessage {
  _id?: Types.ObjectId;

  senderId: Types.ObjectId;
  recieverId: Types.ObjectId;

  text?: string;
  image?: string;

  isRead: boolean;
  readAt?: Date | null;

  createdAt?: Date;
  updatedAt?: Date;
}
