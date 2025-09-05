const userModel = require("../../models/user");
const { successTemplate } = require("../../helper/template");
const logger = require("../../helper/logger");

async function deleteUser(req, res) {
  const user = req.user;
  let { password } = req.body;
  password = password.trim();

  const findUser = await userModel.findByIdAndDelete(user._id);
  logger.log({
    level: "info",
    message: await successTemplate(
      201,
      `${findUser.name} user deleted successfully`
    ),
  });
  res.clearCookie("devconnect-auth-token");
  res
    .status(201)
    .json(
      await successTemplate(201, `${findUser.name} user deleted successfully`)
    );
}

module.exports = deleteUser;
