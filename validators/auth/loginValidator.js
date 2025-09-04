const { failureTemplate } = require("../../helper/template");
const logger = require("../../helper/logger");
const userModel = require("../../models/user");
const encPassword = require("../../helper/encPassword");

async function loginValidation(req, res, next) {
  const { email, password } = req.body;
  if (!email || !password) {
    logger.log({
      level: "info",
      message: await failureTemplate(400, "invalid request body"),
    });
    return res
      .status(400)
      .json(await failureTemplate(400, "invalid request body"));
  }

  const emailRegex = /^[A-Za-z0-9._%+-]{6,}@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
  if (!emailRegex.test(email)) {
    logger.log({
      level: "info",
      message: await failureTemplate(400, "Enter Valid Email"),
    });
    return res
      .status(400)
      .json(await failureTemplate(400, "Enter Valid Email"));
  }

  const findUser = await userModel.findOne({ email: email });

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

   logger.log({
      level: "info",
      message: "User Login Validation Success",
    });

  req.user = {
    _id: findUser._id,
    name: findUser.name,
    email: findUser.email,
  };

  next();
}

module.exports = loginValidation;
