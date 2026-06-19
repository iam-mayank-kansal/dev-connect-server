import { Types } from "mongoose";

export interface IOtp {
  _id?: Types.ObjectId;

  email?: string;
  mobile?: string;

  type: "mobile" | "email";

  otp: string;

  expiringTime: Date;

  status: "pending" | "verified";

  createdAt?: Date;
  updatedAt?: Date;
}
