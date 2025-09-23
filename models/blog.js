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

    blogPhoto: {
        type: [],
      },
  

    blogViedo: {
      type: [],
    },

    
    reactions: {
      likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
      agreed: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
      disagreed: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
    },
  },
  { timestamps: true }
); // adds createdAt and updatedAt automatically

module.exports = mongoose.model("blog", postSchema);
