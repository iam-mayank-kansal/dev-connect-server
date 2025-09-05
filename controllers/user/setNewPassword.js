const encPassword = require("../../helper/encPassword");
const userModel = require("../../models/user");
const logger = require("../../helper/logger");
const { successTemplate } = require("../../helper/template");

async function setNewPassword(req, res) {
  const { user, newPassword } = req.details;

  try {
    const hashedPassword = await encPassword("genrate", newPassword);

    const updatedUser = await userModel.findByIdAndUpdate(
      user._id,
      {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
      },
      { new: true }
    );

    if (updatedUser) {
      res.clearCookie("devconnect-auth-token");
      logger.log({
        level: "info",
        message: await successTemplate(
          201,
          `${updatedUser.name} user password reseted successfully`
        ),
      });

      return res
        .status(200)
        .json(
          await successTemplate(
            201,
            `${updatedUser.name} user password reseted successfully`
          )
        );
    }
  } catch (error) {
    logger.log({
      level: "error",
      message: `Failed to update user password: ${error.message}`,
    });
    return res.status(500).json({
      status: 500,
      message: "Failed to update user password.",
    });
  }
}

module.exports = setNewPassword;
