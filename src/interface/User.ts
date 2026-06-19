import { Types } from "mongoose";

export interface IUser {
  _id?: Types.ObjectId;

  email: string;
  password: string;
  name: string;

  dob?: Date;
  age?: number;

  profilePicture?: string;
  profilePictureId?: string;

  bio?: string;
  designation?: string;

  mobile: {
    countryCode: string;
    number: string;
  };

  location: {
    country: string;
    state: string;
    city: string;
    address: string;
  };

  skills: string[];

  education: {
    degree?: string;
    institution?: string;
    startDate?: Date;
    endDate?: Date;
  }[];

  experience: {
    position?: string;
    company?: string;
    startDate?: Date;
    endDate?: Date;
    description?: string;
  }[];

  certification: {
    company?: string;
    certificate?: string;
    issuedBy?: string;
    issueDate?: Date;
  }[];

  resume?: string;
  resumeId?: string;

  socialLinks: {
    platform?: string;
    url?: string;
  }[];

  resetToken?: string;
  resetTokenExpiry?: Date;

  role: "user" | "admin";

  blogs: Types.ObjectId[];

  connections: {
    connected: Types.ObjectId[];
    blocked: Types.ObjectId[];
    requestReceived: Types.ObjectId[];
    requestSent: Types.ObjectId[];
    ignored: Types.ObjectId[];
  };

  createdAt?: Date;
  updatedAt?: Date;
}
