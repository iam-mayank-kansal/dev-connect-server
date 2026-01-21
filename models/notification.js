const mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema(
  {
    senderId: {
      type: String,
      unique: false,
    },
    receiverId: {
      type: String,
      unique: false,
    },
    status: {
      type: String,
      enum: ["unread", "read"],
      required: true,
    },
    eventName: {
      type: String,
      required: true,
    },
    eventDesc: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const NOTIFICATIONModel = mongoose.model("Notification", NotificationSchema);
module.exports = NOTIFICATIONModel;
