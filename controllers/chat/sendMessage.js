const { successTemplate, failureTemplate } = require("../../helper/template");
const messageModel = require("../../models/MessageSchema");

async function sendMessage(req, res) {
  try {
    const { id: otherUserId } = req.params;
    const userId = req.user._id.toString();

    const { text, image } = req.body;

    const newMessage = new messageModel({
      senderId: userId,
      recieverId: otherUserId,
      text: text,
      image: image,
    });

    await newMessage.save();

    const resposeData = {
      _id: newMessage?._id,
      senderId: newMessage?.senderId,
      recieverId: newMessage?.recieverId,
      image: newMessage?.image,
      text: newMessage?.text,
      createdAt: newMessage?.createdAt,
      isRead: newMessage?.isRead,
      readAt: newMessage?.readAt,
    };

    const response = await successTemplate(
      200,
      `Message Send Successfully to user : ${otherUserId}`,
      resposeData
    );

    res.json(response);
  } catch (err) {
    console.error(err);
    res.json(failureTemplate(400, `Error Sending Message : ${err.message}`));
  }
}

module.exports = sendMessage;
