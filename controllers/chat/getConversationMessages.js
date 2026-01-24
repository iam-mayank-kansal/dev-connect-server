const { successTemplate, failureTemplate } = require("../../helper/template");
const messageModel = require("../../models/MessageSchema");

async function getConversationMessages(req, res) {
  try {
    const { id: otherUserId } = req.params;
    const userId = req.user._id.toString();

    const messages = await messageModel
      .find(
        {
          $or: [
            { senderId: userId, recieverId: otherUserId },
            { senderId: otherUserId, recieverId: userId },
          ],
        },
        { __v: 0 }
      )
      .lean();

    res.json(
      successTemplate(
        200,
        `Message Send Successfully to user : ${otherUserId}`,
        messages
      )
    );
  } catch (err) {
    console.error(err);
    res.json(
      failureTemplate(400, `Error Fetching Conversation : ${err.message}`)
    );
  }
}

module.exports = getConversationMessages;
