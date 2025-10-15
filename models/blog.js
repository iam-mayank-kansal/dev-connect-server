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

    // why we need like agree disagree separately  ------------------------------ fixed
    // isnt like means agree and dislike means disagree  ----------------------------- fixed
    reactions: {
      agreed: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
      disagreed: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
    },
  },
  { timestamps: true }
); // adds createdAt and updatedAt automatically

module.exports = mongoose.model("blog", postSchema);
