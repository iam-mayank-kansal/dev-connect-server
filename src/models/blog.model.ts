import mongoose from "mongoose";
import type { InferSchemaType } from "mongoose";

const postSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    blogTitle: {
      type: String,
    },
    blogBody: {
      type: String,
    },

    blogPhoto: [
      {
        url: {
          type: String,
        },
        fileId: {
          type: String,
        },
        _id: false,
      },
    ],

    blogViedo: [
      {
        url: {
          type: String,
        },
        fileId: {
          type: String,
        },
        _id: false,
      },
    ],

    reactions: {
      agreed: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
      disagreed: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
    },
  },
  { timestamps: true }
);

export const blogModel = mongoose.model("blog", postSchema);

export type IBlog = InferSchemaType<typeof postSchema>;
