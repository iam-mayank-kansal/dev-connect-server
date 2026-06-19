import { Types } from "mongoose";

export interface Blog {
  _id?: Types.ObjectId;

  userId: Types.ObjectId;

  blogTitle?: string;
  blogBody?: string;

  blogPhoto: {
    url?: string;
    fileId?: string;
  }[];

  blogViedo: {
    url?: string;
    fileId?: string;
  }[];

  reactions: {
    agreed: Types.ObjectId[];
    disagreed: Types.ObjectId[];
  };

  createdAt?: Date;
  updatedAt?: Date;
}
