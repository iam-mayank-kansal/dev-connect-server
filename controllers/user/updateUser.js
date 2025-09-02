const userModel = require("../../models/user");
const { updateUserTemplate } = require("../../helper/template");
const logger = require("../../helper/logger");
const calculateAge = require("../../helper/calculateAge");
const { v4: uuid } = require("uuid");

async function updateUser(req, res) {
  const user = req.user;
  const findUser = await userModel.findById(user._id);
  //fields array
  const allowedFields = ["name", "mobile", "bio", "dob", "designation"];
  const payload = {};
  //only run that code block which matches with the allowFields array
  for (const key of allowedFields) {
    if (req.body[key] !== undefined) {
      payload[key] = req.body[key];
    }
  }

  //for photo refernece
  const imageStringFormat = `DevConnect-userprofilePic.${new Date().toISOString().replace(/:/g, "-").split(".")[0]}.${uuid()}`;
  const userProfilePicRefrence = req.file
    ? `${user.email}.${imageStringFormat}`
    : null;

  await userModel.findByIdAndUpdate(user._id, {
    name: payload.name?.trim(),
    mobile: payload.mobile,
    bio: payload.bio?.trim(),
    dob: payload.dob?.trim(),
    designation: payload.designation?.trim(),
    age: payload.dob ? calculateAge(payload.dob?.trim()) : null,
    profilePic: userProfilePicRefrence,
  });

  const updatedUser = await userModel.findById(user._id);

  logger.log({
    level: "info",
    message: await updateUserTemplate(findUser.name, updatedUser),
    userAction: "user updated successfully",
  });
  return res
    .status(200)
    .json(await updateUserTemplate(findUser.name, updatedUser));
}

module.exports = updateUser;
