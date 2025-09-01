const userModel = require("../../models/user");
const encPassword = require("../../helper/encPassword");
const { updateUserTemplate } = require("../../helper/template");
const logger = require("../../helper/logger");
const calculateAge = require("../../helper/calculateAge");


async function updateUser(req, res) {
  const user = req.user;
  
  const { password, name, mobile, bio, dob, designation } = req.body;
    
  //for photo refernece
  const userProfilePicRefrence = req.file ? `${user.email}/${req.file.originalname}` : null;
  
  //for photo buffer
  const userPhotoBase64= req.file ? req.file.buffer.toString('base64'):null;
 
 
  await userModel.findByIdAndUpdate(user._id, {
    password: await encPassword("genrate", password),
    name: name.trim(),
    mobile: mobile,
    bio: bio.trim(),
    dob: dob.trim(),
    designation: designation.trim(),
    age: calculateAge(dob.trim()),
    profilePic:userPhotoBase64,
    profilePicRefrence: userProfilePicRefrence,
  });

  const updatedUser = await userModel.findById(user._id);

  logger.log({
    level: "info",
    message: await updateUserTemplate(name, updatedUser),
    userAction: "user updated successfully",
  });
  return res.status(200).json(await updateUserTemplate(name, updatedUser));
}

module.exports = updateUser;