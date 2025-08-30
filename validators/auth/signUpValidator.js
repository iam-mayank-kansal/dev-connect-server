const { failureTemplate } = require("../../helper/template");
const logger = require("../../helper/logger");
const userModel = require("../../models/user");

async function signUpValidation(req, res, next) {
  const { name, email, password, mobile } = req.body;
  if ((!name, !email, !password, !mobile)) {
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

  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
  if (!passwordRegex.test(password)) {
    logger.log({
      level: "info",
      message: await failureTemplate(
        400,
        "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&)."
      ),
    });
    return res
      .status(400)
      .json(
        await failureTemplate(
          400,
          "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&)."
        )
      );
  }

  if (name.length < 3) {
    logger.log({
      level: "info",
      message: await failureTemplate(400, "Enter Valid Name"),
    });
    return res.status(400).json(await failureTemplate(400, "Enter Valid Name"));
  }

  const mobileRegex = /^[6-9]\d{9}$/;
  if (!mobileRegex.test(mobile)) {
    logger.log({
      level: "info",
      message: await failureTemplate(
        400,
        "Mobile number must be 10 digits long, start with 6, 7, 8, or 9, and can optionally include the country code +91."
      ),
    });
    return res
      .status(400)
      .json(
        await failureTemplate(
          400,
          "Mobile number must be 10 digits long, start with 6, 7, 8, or 9, and can optionally include the country code +91."
        )
      );
  }

  const existingUser = await userModel.findOne({ email: email });
  if (existingUser) {
    logger.log({
      level: "info",
      message: await failureTemplate(
        400,
        "account already exists ! kindly use another email"
      ),
    });
    return res
      .status(400)
      .json(
        await failureTemplate(
          400,
          "account already exists ! kindly use another email"
        )
      );
  }

  next();
}

module.exports = signUpValidation;
