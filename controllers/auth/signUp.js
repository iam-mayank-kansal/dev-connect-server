const userModel = require("../../models/user");
const encPassword = require("../../helper/encPassword");
const { registerUserTemplate } = require("../../helper/template");
const logger = require("../../helper/logger");

async function signUp(req, res) {
  const { name, email, password, mobile } = req.body;
  await userModel.insertOne({
    name: name.trim(),
    email: email.trim(),
    password: await encPassword("genrate", password),
    mobile: mobile.trim(),
  });

  logger.log({
    level: "info",
    message: await registerUserTemplate(name, email, password, mobile),
  });
  return res
    .status(200)
    .json(await registerUserTemplate(name, email, password, mobile));
}

module.exports = signUp;
