const mongoose = require("mongoose");
const { COLLECTION_STATUS } = require("../utils/enum");

// creating user schema
const userConnectionSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    status: {
      required: true,
      type: String,
      enum: COLLECTION_STATUS,
    },
    block: {
      fromUser: {
        type:Boolean,
        required: true,
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
