const { successTemplate, failureTemplate } = require("../../helper/template");
const messageModel = require("../../models/MessageSchema");
const userModel = require("../../models/user");

async function getUsersForSlider(req, res) {
  try {
    const userId = req.user._id.toString();

    const messages = await messageModel.find(
      {
        $or: [{ senderId: userId }, { recieverId: userId }],
      },
      { senderId: 1, recieverId: 1 }
    );

    // Set to remove duplicates
    const engagedUserSet = new Set();

    for (const msg of messages) {
      if (msg.senderId.toString() === userId) {
        engagedUserSet.add(msg.recieverId.toString());
      } else {
        engagedUserSet.add(msg.senderId.toString());
      }
    }

    const engagedUserIds = [...engagedUserSet];

    const engagedUsers = await userModel.find(
      { _id: { $in: engagedUserIds } },
      {
        name: 1,
        designation: 1,
        profilePicture: 1,
      }
    );

    res.status(200).json(
      successTemplate(200, "Engaged Users for Slider Fetched Successfully", {
        count: engagedUsers.length,
        users: engagedUsers,
      })
    );
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json(
        failureTemplate(
          400`Error Fetching Engaged Users for Slider ${err.message}`
        )
      );
  }
}

module.exports = getUsersForSlider;
