const { failureTemplate } = require("../../helper/template");
const logger = require("../../helper/logger");
const userModel = require("../../models/user");
const encPassword = require("../../helper/encPassword");

async function deleteValidation(req, res, next) {
  const { name, email, password, mobile } = req.body;
  if ((!email, !password)) {
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
  // console.log(storeHash)

  const checkUser = await encPassword("compare", password, storeHash);
  // console.log(checkUser);

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
