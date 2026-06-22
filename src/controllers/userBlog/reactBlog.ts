import { blogModel } from "@/models/blog.model";
import { userModel } from "@/models/user.model";
import { successTemplate, failureTemplate } from "@/helper/template";
import logger from "@/helper/logger";
import type { Request, Response } from "express";

async function reactBlog(req: Request, res: Response) {
  try {
    const userId = req.user!._id;
    const { blogId, reaction } = req.updateReaction; // comes from validator
    const normalizedReaction = reaction;

    // This part is perfect. It always removes the user from any previous reaction arrays.
    await blogModel.updateOne(
      { _id: blogId },
      {
        $pull: {
          "reactions.agreed": userId,
          "reactions.disagreed": userId,
        },
      }
    );

    // CHANGE: Only add the user to a new reaction array if the reaction is NOT empty.
    if (normalizedReaction === "agree" || normalizedReaction === "disagree") {
      let reactionField = "";
      if (normalizedReaction === "agree") reactionField = "reactions.agreed";
      if (normalizedReaction === "disagree")
        reactionField = "reactions.disagreed";

      await blogModel.updateOne(
        { _id: blogId },
        { $addToSet: { [reactionField]: userId } }
      );
    }
    // NOTE: If normalizedReaction is an empty string, the 'if' block is skipped.
    // This means the user's reaction is simply removed, achieving the "undo" effect.

    // Fetch updated blog to return the new counts.
    const updatedBlog = await blogModel.findById(blogId);

    const userNameDoc = await userModel.findById(userId).select("name -_id");
    const userName = userNameDoc?.name || "User";

    const responseData = {
      postId: updatedBlog!._id,
      agreedCount: updatedBlog!.reactions!.agreed.length,
      disagreedCount: updatedBlog!.reactions!.disagreed.length,
      // The rest of the fields were removed as they aren't needed by the frontend.
    };

    logger.log({
      level: "info",
      message: JSON.stringify(
        successTemplate(
          200,
          `${userName} reacted with ${normalizedReaction || "none"}`,
          responseData
        )
      ),
      userAction: `user reacted with ${normalizedReaction || "none"}`,
    });

    return res
      .status(200)
      .json(
        successTemplate(
          200,
          `${userName} reacted with ${normalizedReaction || "none"}`,
          responseData
        )
      );
  } catch (error: any) {
    logger.log({
      level: "error",
      message: `Error in reactBlog controller: ${error.message}`,
    });

    return res.status(500).json(failureTemplate(500, "Internal Server Error"));
  }
}

export default reactBlog;
