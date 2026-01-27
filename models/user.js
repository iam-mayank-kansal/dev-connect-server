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
      default: "Hey, I am using DevConnect!",
    },
    designation: {
      type: String,
      default: "User",
    },

    mobile: {
      countryCode: { type: String, default: "+91" },
      number: { type: String, default: "" },
    },

    location: {
      country: { type: String, default: "" },
      state: { type: String, default: "" },
      city: { type: String, default: "" },
      address: { type: String, default: "" },
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
      default: "",
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
    },
    resetTokenExpiry: {
      type: Date,
    },

    // platform control
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    blogs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "blog",
      },
    ],
    connections: {
      connected: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "user",
        },
      ],
      blocked: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "user",
        },
      ],
      requestReceived: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "user",
        },
      ],
      requestSent: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "user",
        },
      ],
      ignored: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "user",
        },
      ],
    },
  },
  { timestamps: true }
);

// creating user model
const userModel = mongoose.model("user", userSchema);

module.exports = userModel;
