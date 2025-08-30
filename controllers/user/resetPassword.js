const userModel = require("../../models/user");
const { resetUserPasswordTemplate } = require("../../helper/template");
const logger = require("../../helper/logger");
const encPassword = require("../../helper/encPassword");
const jwt = require("jsonwebtoken");

async function resetPassword(req, res) {
  const { newpassword } = req.body;
  //extracting user based on mongo --> documnet id
  const userCookie = await req.cookies.devConnect;
  const decodeValue = jwt.verify(userCookie, process.env.SECRETKEY);

  const userId = decodeValue.payload;

  const resetUserPassword = await userModel.findOneAndUpdate(
    { _id: userId },
    { password: await encPassword("genrate", newpassword) }
  );
  logger.log({
    level: "info",
    message: await resetUserPasswordTemplate(resetUserPassword.name),
  });
  res.status(201).json(await resetUserPasswordTemplate(resetUserPassword.name));
}

module.exports = resetPassword;
