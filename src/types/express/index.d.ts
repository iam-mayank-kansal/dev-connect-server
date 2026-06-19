import { Types } from "mongoose";

declare global {
  namespace Express {
    interface UserPayload {
      _id: string | Types.ObjectId;
      name: string;
      email: string;
      mobile?: string;
      profilePicture?: string;
      otpType?: "email" | "mobile";
    }

    interface newPasswordDetails {
      user: any;
      newPassword: string;
    }

    interface otpDetails {
      email: string;
      mobile?: string;
      type: "mobile" | "email";
      otp: string;
      expiringTime: Date;
      status: "pending" | "verified";
    }

    interface Request {
      user?: UserPayload;
      details?: newPasswordDetails | undefined;
      otpDetails?: otpDetails;
    }
  }
}

export {};
