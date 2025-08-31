const userModel = require("../../models/user");
const encPassword = require("../../helper/encPassword");
const { updateUserTemplate } = require("../../helper/template");
const logger = require("../../helper/logger");
const calculateAge = require("../../helper/calculateAge");
async function updateUser(req, res) {
  const user = req.user;
  const { password, name, mobile, bio, dob, designation } = req.body;
  await userModel.findByIdAndUpdate(user._id, {
    password: await encPassword("genrate", password),
    name: name.trim(),
    mobile: mobile,
    bio: bio.trim(),
    dob: dob.trim(),
    designation: designation.trim(),
    age: calculateAge(dob.trim()),
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
