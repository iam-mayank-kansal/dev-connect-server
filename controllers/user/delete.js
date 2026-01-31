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

  const isProduction = process.env.NODE_ENV === "production";

  res.clearCookie("devconnect-auth-token", {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "None" : "Lax",
    domain: isProduction ? ".vercel.app" : undefined,
    path: "/",
  });
  res
    .status(201)
    .json(
      await successTemplate(201, `${findUser.name} user deleted successfully`)
    );
}

module.exports = deleteUser;
