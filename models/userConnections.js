const mongoose = require("mongoose");
const { COLLECTION_STATUS } = require("../utils/enum");

// creating user schema
const userConnectionSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user", // Added reference to the User model
      required: true,
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user", // Added reference to the User model
      required: true,
    },
    status: {
      required: true,
      type: String,
      enum: COLLECTION_STATUS,
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

// creating user model
const userConnectionModel = mongoose.model(
  "userConnections",
  userConnectionSchema
);
module.exports = userConnectionModel;
