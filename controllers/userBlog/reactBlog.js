const blogModel = require("../../models/blog");
const userModel = require("../../models/user");
const { successTemplate, failureTemplate } = require("../../helper/template");
const logger = require("../../helper/logger");

async function reactBlog(req, res) {
  try {
    const userId = req.user._id;
    const { blogId, reaction } = req.updateReaction; // ✅ comes from validator
    const normalizedReaction = reaction;

    // ✅ First remove user from all reaction arrays
    await blogModel.updateOne(
      { _id: blogId },
      {
        $pull: {
          "reactions.agreed": userId,
          "reactions.disagreed": userId,
        },
      }
    );

    // ✅ Add user to the new reaction array
    let reactionField = "";
    if (normalizedReaction === "agree") reactionField = "reactions.agreed";
    if (normalizedReaction === "disagree") reactionField = "reactions.disagreed";

    await blogModel.updateOne(
      { _id: blogId },
      { $addToSet: { [reactionField]: userId } }
    );

    // ✅ Fetch updated blog with populated reaction users
    const blogWithReactions = await blogModel
      .findById(blogId)
      .populate("reactions.agreed", "name")
      .populate("reactions.disagreed", "name");

    const userNameDoc = await userModel.findById(userId).select("name -_id");
    const userName = userNameDoc?.name || "User";

    const responseData = {
      postId: blogWithReactions._id,
      agreedCount: blogWithReactions.reactions.agreed.length,
      disagreedCount: blogWithReactions.reactions.disagreed.length,
      likes: blogWithReactions.reactions.likes,
      agreed: blogWithReactions.reactions.agreed,
      disagreed: blogWithReactions.reactions.disagreed,
    };

    logger.log({
      level: "info",
      message: await successTemplate(
        200,
        `${userName} reacted with ${normalizedReaction}`,
        responseData
      ),
      userAction: `user reacted with ${normalizedReaction}`,
    });

    return res.status(200).json(
      await successTemplate(
        200,
        `${userName} reacted with ${normalizedReaction}`,
        responseData
      )
    );
  } catch (error) {
    console.error(error.message);

    logger.log({
      level: "error",
      message: `Error in reactBlog controller: ${error.message}`,
    });

    return res
      .status(500)
      .json(await failureTemplate(500, "Internal Server Error"));
  }
}

module.exports = reactBlog;
