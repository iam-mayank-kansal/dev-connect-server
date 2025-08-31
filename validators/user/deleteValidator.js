const { failureTemplate } = require("../../helper/template");
const logger = require("../../helper/logger");
const userModel = require("../../models/user");
const encPassword = require("../../helper/encPassword");

async function deleteValidation(req, res, next) {
  const user = req.user;
  const { password } = req.body;
  if (!password) {
    logger.log({
      level: "info",
      message: await failureTemplate(400, "invalid request body"),
    });
    return res
      .status(400)
      .json(await failureTemplate(400, "invalid request body"));
  }

  const findUser = await userModel.findById(user._id);

  if (findUser == null) {
    logger.log({
      level: "info",
      message: await failureTemplate(
        400,
        "User does not exists! kindly contact adminitrator for registration"
      ),
    });

    return res
      .status(400)
      .json(
        await failureTemplate(
          400,
          "User does not exists! kindly contact adminitrator for registration"
        )
      );
  }

  const storeHash = findUser.password;

  const checkUser = await encPassword("compare", password, storeHash);

  if (checkUser == false) {
    logger.log({
      level: "info",
      message: await failureTemplate(400, "Invalid password"),
    });

    return res.status(400).json(await failureTemplate(400, "Invalid password"));
  }

  next();
}

module.exports = deleteValidation;
