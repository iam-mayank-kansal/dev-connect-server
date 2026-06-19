import mongoose from "mongoose";
import type { InferSchemaType } from "mongoose";

const userConnectionSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },

    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },

    status: {
      type: String,
      required: true,
      // need to add a connection status enum
      enum: ["interested", "accepted", "none"],
    },

    block: {
      user1: {
        type: mongoose.Schema.Types.ObjectId,
        default: null,
      },

      user2: {
        type: mongoose.Schema.Types.ObjectId,
        default: null,
      },
    },

    ignore: {
      user1: {
        type: mongoose.Schema.Types.ObjectId,
        default: null,
      },

      user2: {
        type: mongoose.Schema.Types.ObjectId,
        default: null,
      },
    },
  },
  { timestamps: true }
);

export const userConnectionModel = mongoose.model(
  "userConnections",
  userConnectionSchema
);

export type IUserConnection = InferSchemaType<typeof userConnectionSchema>;
