const jwt = require("jsonwebtoken");
const { successTemplate } = require("../../helper/template");
const logger = require("../../helper/logger");

async function login(req, res) {
  const user = req.user;

  //creating jwt token on successful login
  const payload = user;
  const token = jwt.sign({ payload }, process.env.JWT_SECRET_KEY, {
    expiresIn: "1h",
  });
  res.cookie("devconnect-auth-token", token, { httpOnly: true, secure: false });
  logger.log({
    level: "info",
    message: await successTemplate(
      201,
      `${user.name} user logged in successfully`,
      user
    ),
    jwtToken: token,
  });
  res
    .status(201)
    .json(
      await successTemplate(
        201,
        `${user.name} user logged in successfully`,
        user
      )
    );
}

module.exports = login;
