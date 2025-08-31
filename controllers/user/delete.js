const userModel = require("../../models/user");
const { delteUserTemplate } = require("../../helper/template");
const logger = require("../../helper/logger");
const cookie = require("cookie-parser");

async function deleteUser(req, res) {
  const user = req.user;
  let { password } = req.body;
  password = password.trim();

  const findUser = await userModel.findByIdAndDelete(user._id);
  logger.log({
    level: "info",
    message: await delteUserTemplate(findUser.name),
  });
  res.clearCookie("devconnect-auth-token");
  res.status(201).json(await delteUserTemplate(findUser.name));
}

module.exports = deleteUser;
