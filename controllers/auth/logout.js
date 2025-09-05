const logger = require("../../helper/logger");
const { logoutUserTemplate } = require("../../helper/template");

async function logout(req, res) {
  res.clearCookie("devconnect-auth-token");
  logger.log({
    level: "info",
    message: await logoutUserTemplate(),
  });
  res.status(200).json(await logoutUserTemplate());
}

module.exports = logout;
