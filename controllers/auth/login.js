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
  res.cookie("devconnect-auth-token", token, { httpOnly: true, secure: false });
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
