const mongoose = require("mongoose");

//creating user schema
const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
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
      countryCode: {
        type: String,
      },
      number: {
        type: String,
      },
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
    location: {
      country: String,
      state: String,
      pincode: String,
      address: String,
    },
    socialLinks: [
      {
        title: String,
        link: String,
      },
    ],
    skills: {
      type: [String],
      default: [],
    },
    education: {
      type: [
        {
          degree: String,
          institution: String,
          period: String,
        },
      ],
      default: [],
    },
    experience: {
      type: [
        {
          position: String,
          company: String,
          period: String,
          description: String,
          image: String,
        },
      ],
      default: [],
    },
    cvLink: String,
    certification: {
      type: [
        {
          certificate: String,
          time: String,
          image: String,
        },
      ],
      default: [],
    },
  },
  { timestamps: true }
);

//creating user model
const userModel = mongoose.model("user", userSchema);

//exporting user model
module.exports = userModel;
