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
    },
    bio: {
      type: String,
      default: "Hey, i am using DevConnect!",
    },
    designation: {
      type: String,
    },

    mobile: {
      countryCode: { type: String },
      number: { type: String },
    },

    location: {
      country: String,
      state: String,
      city: String,
      address: String,
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
        endDate: Date,
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
        certificate: String,
        issuedBy: String,
        issueDate: Date,
        _id: false,
      },
    ],

    resume: {
      type: String,
    },

    // social links
    socialLinks: [
      {
        title: String,
        link: String,
        _id: false,
      },
    ],

    // security
    resetToken: String,
    resetTokenExpiry: Date,

    // platform control
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    accountStatus: {
      type: String,
      enum: ["active", "suspended", "pending"],
      default: "active",
    },
  },
  { timestamps: true }
);

// creating user model
const userModel = mongoose.model("user", userSchema);

module.exports = userModel;
