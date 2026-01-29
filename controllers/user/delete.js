const userModel = require("../../models/user");
const { successTemplate } = require("../../helper/template");
const logger = require("../../helper/logger");

async function deleteUser(req, res) {
  const user = req.user;

  const findUser = await userModel.findByIdAndDelete(user._id);
  logger.log({
    level: "info",
    message: await successTemplate(
      201,
      `${findUser.name} user deleted successfully`
    ),
  });
  res.clearCookie("devconnect-auth-token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
  });
  res
    .status(201)
    .json(
      await successTemplate(201, `${findUser.name} user deleted successfully`)
    );
}

module.exports = deleteUser;
