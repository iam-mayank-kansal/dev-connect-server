const mongoose = require("mongoose");

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

    // Store photo objects with url and fileId for ImageKit deletion
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

    // Store video objects with url and fileId for ImageKit deletion
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

module.exports = mongoose.model("blog", postSchema);
