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
    message: successTemplate(
      201,
      `${resetUserPassword.name} user password updated successfully`
    ),
  });

  const isProduction = process.env.NODE_ENV === "production";

  res.clearCookie("devconnect-auth-token", {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "None" : "Lax",
    path: "/",
  });
  res
    .status(201)
    .json(
      successTemplate(
        201,
        `${resetUserPassword.name} user password updated successfully`
      )
    );
}

module.exports = resetPassword;
