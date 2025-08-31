const userModel = require("../../models/user");
const { resetUserPasswordTemplate } = require("../../helper/template");
const logger = require("../../helper/logger");
const encPassword = require("../../helper/encPassword");
const jwt = require("jsonwebtoken");

async function resetPassword(req, res) {
  const user = req.user;
  const { newpassword } = req.body;

  const resetUserPassword = await userModel.findOneAndUpdate(
    { _id: user._id },
    { password: await encPassword("genrate", newpassword) }
  );
  logger.log({
    level: "info",
    message: await resetUserPasswordTemplate(resetUserPassword.name),
  });
  res.clearCookie("devconnect-auth-token");
  res.status(201).json(await resetUserPasswordTemplate(resetUserPassword.name));
}

module.exports = resetPassword;
