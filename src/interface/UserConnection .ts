import { Types } from "mongoose";

export type ConnectionStatus =
  | "pending"
  | "accepted"
  | "rejected"
  | "blocked"
  | "ignored";

export interface IUserConnection {
  _id?: Types.ObjectId;

  fromUserId: Types.ObjectId;
  toUserId: Types.ObjectId;

  status: ConnectionStatus;

  block: {
    user1: Types.ObjectId | null;
    user2: Types.ObjectId | null;
  };

  ignore: {
    user1: Types.ObjectId | null;
    user2: Types.ObjectId | null;
  };

  createdAt?: Date;
  updatedAt?: Date;
}
