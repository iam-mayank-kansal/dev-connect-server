const jwt = require("jsonwebtoken");
const { successTemplate } = require("../../helper/template");
const logger = require("../../helper/logger");

async function login(req, res) {
  const user = req.user;

  //creating jwt token on successful login
  const payload = user;
  const token = jwt.sign({ payload }, process.env.JWT_SECRET_KEY, {
    expiresIn: "5h",
  });

  // For cross-domain cookies to work: must have secure: true and sameSite: "None"
  const isProduction = process.env.NODE_ENV === "production";

  res.cookie("devconnect-auth-token", token, {
    httpOnly: true,
    secure: isProduction, // MUST be true for HTTPS (production)
    sameSite: isProduction ? "None" : "Lax", // "None" required for cross-origin
    maxAge: 5 * 60 * 60 * 1000, // 5 hours
  });

  logger.log({
    level: "info",
    message: "Cookie set with options",
    cookieOptions: {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "None" : "Lax",
      nodeEnv: process.env.NODE_ENV,
    },
  });
  logger.log({
    level: "info",
    message: successTemplate(
      201,
      `${user.name} user logged in successfully`,
      payload
    ),
  });
  res
    .status(201)
    .json(
      successTemplate(201, `${user.name} user logged in successfully`, payload)
    );
}

module.exports = login;
