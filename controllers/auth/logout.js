const logger = require("../../helper/logger");
const { successTemplate } = require("../../helper/template");

async function logout(req, res) {
  res.clearCookie("devconnect-auth-token");
  logger.log({
    level: "info",
    message: await successTemplate(201, "user logged out successfully"),
  });
  res
    .status(200)
    .json(await successTemplate(201, "user logged out successfully"));
}

module.exports = logout;
