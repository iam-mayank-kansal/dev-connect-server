const userModel = require("../../models/user");
const { displayUserTemplate } = require("../../helper/template");
const logger = require("../../helper/logger");
const cookie = require("cookie-parser");

async function displayUser(req, res) {
  const user = req.user;

  const findUser = await userModel.findById(user._id)
    .select('-password -updatedAt -resetToken -resetTokenExpiry -__v');
  logger.log({
    level: "info",
    action: "user displayed successfully",
    message: await displayUserTemplate(findUser),
  });
  res.status(201).json(await displayUserTemplate(findUser));
}

module.exports = displayUser;


