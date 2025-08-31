const { failureTemplate } = require("../../helper/template");
const logger = require("../../helper/logger");
const userModel = require("../../models/user");

async function signUpValidation(req, res, next) {
  const { name, email, password } = req.body;
  if ((!name, !email, !password)) {
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

  if (name.length < 3 || name.length > 20) {
    logger.log({
      level: "info",
      message: await failureTemplate(400, "Enter Valid Name"),
    });
    return res.status(400).json(await failureTemplate(400, "Enter Valid Name"));
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
