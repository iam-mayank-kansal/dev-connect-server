const logger = require("../../helper/logger");
const { successTemplate } = require("../../helper/template");

async function logout(req, res) {
  res.clearCookie("devconnect-auth-token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
  });
  logger.log({
    level: "info",
    message: successTemplate(201, "user logged out successfully"),
  });
  res.status(200).json(successTemplate(201, "user logged out successfully"));
}

module.exports = logout;
