const userModel = require("../../models/user");
const { successTemplate } = require("../../helper/template");
const logger = require("../../helper/logger");
const encPassword = require("../../helper/encPassword");

async function resetPassword(req, res) {
  const user = req.user;
  const { newPassword } = req.body;

  const resetUserPassword = await userModel.findOneAndUpdate(
    { _id: user._id },
    { password: await encPassword("genrate", newPassword) }
  );
  logger.log({
    level: "info",
    message: await successTemplate(
      201,
      `${resetUserPassword.name} user password updated successfully`
    ),
  });
  res.clearCookie("devconnect-auth-token");
  res
    .status(201)
    .json(
      await successTemplate(
        201,
        `${resetUserPassword.name} user password updated successfully`
      )
    );
}

module.exports = resetPassword;
