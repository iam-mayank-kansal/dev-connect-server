const mongoose = require("mongoose");

// creating user schema
const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    dob: {
      type: Date,
    },
    age: {
      type: Number,
      min: 0,
    },
    profilePicture: {
      type: String,
      default: "https://i.ibb.co/6P01K0c/default-profile.png", // Added a default URL
    },
    bio: {
      type: String,
      default: "Hey, I am using DevConnect!",
    },
    designation: {
      type: String,
      default: "User", // Added a default designation
    },

    mobile: {
      countryCode: { type: String, default: "+91" }, // Corrected structure and added default
      number: { type: String, default: "" }, // Added default value},
    },

    location: {
      country: { type: String, default: "" }, // Corrected structure for default
      state: { type: String, default: "" }, // Added default
      city: { type: String, default: "" }, // Added default
      address: { type: String, default: "" }, // Added default
    },

    skills: {
      type: [String],
      default: [],
    },

    education: [
      {
        degree: String,
        institution: String,
        startDate: Date,
        endDate: Date, // null if currently working
        _id: false,
      },
    ],

    experience: [
      {
        position: String,
        company: String,
        startDate: Date,
        endDate: Date, // null if currently working
        description: String,
        _id: false,
      },
    ],

    certification: [
      {
        company: String,
        certificate: String,
        issuedBy: String,
        issueDate: Date,
        _id: false,
      },
    ],

    resume: {
      type: String,
      default: "", // Added a default empty string
    },

    // social links
    socialLinks: [
      {
        platform: String,
        url: String,
        _id: false,
      },
    ],

    // security
    resetToken: {
      type: String,
      default: null, // Added default
    },
    resetTokenExpiry: {
      type: Date,
      default: null, // Added default
    },

    // platform control
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
  },
  { timestamps: true }
);

// creating user model
const userModel = mongoose.model("user", userSchema);

module.exports = userModel;