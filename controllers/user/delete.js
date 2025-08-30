const userModel = require("../../models/user");
const { delteUserTemplate } = require("../../helper/template");
const logger = require("../../helper/logger");
const cookie = require("cookie-parser");

async function deleteUser(req, res) {
  let { email, password } = req.body;
  email = email.trim();
  password = password.trim();

  const findUser = await userModel.findOneAndDelete({ email: email });

  if (findUser != null) {
    logger.log({
      level: "info",
      message: await delteUserTemplate(findUser.name),
    });

    res.clearCookie("devConnect");
    res.status(201).json(await delteUserTemplate(findUser.name));
  }
}

module.exports = deleteUser;
