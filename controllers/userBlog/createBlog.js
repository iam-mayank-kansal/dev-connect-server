const blogModel = require("../../models/blog");
const userModel = require("../../models/user"); // 1. Import userModel
const mongoose = require("mongoose"); // 2. Import mongoose for transactions
const { successTemplate, failureTemplate } = require("../../helper/template");
const logger = require("../../helper/logger");
const handleNotification = require("../../helper/notification");

async function createBlog(req, res) {
  // 3. Start a session for the transaction
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const userId = req.user._id;
    let { blogTitle, blogBody } = req.body;
    const reqFileData = req.files;

    const updateData = {
      userId: userId,
      blogTitle: blogTitle ? blogTitle.trim() : "",
      blogBody: blogBody ? blogBody.trim() : "",
      blogPhoto: reqFileData?.contentPhoto?.map((file) => file.filename) || [],
      blogViedo: reqFileData?.contentViedo?.map((file) => file.filename) || [],
    };

    // 4. Create the blog post within the session
    // Note: .create() returns an array when used with sessions
    const newBlogArray = await blogModel.create([updateData], { session });
    const uploadedBlog = newBlogArray[0]; // Get the actual blog document

    // 5. Update the user's 'blogs' array with the new blog's ID
    await userModel.findByIdAndUpdate(
      userId,
      { $push: { blogs: uploadedBlog._id } }, // Add the new blog ID to the array
      { session, new: true } // Pass the session
    );

    // 6. If both operations succeed, commit the transaction
    await session.commitTransaction();

    // Now that the transaction is complete, fetch the populated blog for the response
    const blog = await blogModel
      .findById(uploadedBlog._id)
      .select("-_id -updatedAt")
      .populate("userId", "name");

    //sending notification on successblog upload
    if (blog) {
      //fetch user connected to current logged in user
      const userList = await userModel
        .findById(userId)
        .select("connections.connected -_id");

      //to get array list of all freinds of that user
      const userArray = userList?.connections?.connected;
      // console.log(userArray);

      //lopping all userArray input if userArray exists
      if (userArray) {
        const userName = req.user?.name;
        const eventName = "Blog Uploaded";
        const evenDesc = `${userName} just now has uploaded a blog ! `;
        for (const userArr of userArray) {
          handleNotification(userId, userArr, eventName, evenDesc).catch(
            (err) => {
              console.log(err);
              logger.error("Notification failed", err.message);
            }
          );
        }
      }
    }
    // log and send the response
    logger.log({
      level: "info",
      message: await successTemplate(201, `Blog posted successfully`, blog),
      userAction: "user blog posted successfully",
    });
    return res
      .status(200)
      .json(
        await successTemplate(
          201,
          `${blog?.userId?.name} user blog posted successfully`,
          blog
        )
      );
  } catch (error) {
    // 7. If any error occurs, abort the transaction
    await session.abortTransaction();

    logger.log({
      level: "error",
      message: `Error in createBlog controller: ${error.message}`,
    });
    return res
      .status(500)
      .json(await failureTemplate(500, "Internal Server Error"));
  } finally {
    // 8. Always end the session
    session.endSession();
  }
}

module.exports = createBlog;
