const mongoose = require("mongoose");

//creating user schema
const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
    },
    mobile: {
      type: Number,
    },
    bio: {
      type: String,
      default: "Hello i am a devconnect user",
    },
    dob: {
      type: String,
    },
    designation: {
      type: String,
    },
    profilePic: {
      type: String,
    },
    profilePicRefrence: {
      type: String,
    },
    resetToken: {
      type: String,
    },
    resetTokenExpiry: {
      type: Date,
    },
  },
  { timestamps: true }
);

//creating user model
const userModel = mongoose.model("user", userSchema);

//exporting user model
module.exports = userModel;