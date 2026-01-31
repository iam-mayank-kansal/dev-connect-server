const logger = require("../../helper/logger");
const { successTemplate } = require("../../helper/template");

async function logout(req, res) {
  const isProduction = process.env.NODE_ENV === "production";

  res.clearCookie("devconnect-auth-token", {
    httpOnly: true,
    secure: isProduction,
    sameSite: "Lax",
    path: "/",
  });
  logger.log({
    level: "info",
    message: successTemplate(201, "user logged out successfully"),
  });
  res.status(200).json(successTemplate(201, "user logged out successfully"));
}

module.exports = logout;
