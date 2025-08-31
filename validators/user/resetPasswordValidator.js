const { failureTemplate } = require("../../helper/template");
const logger = require("../../helper/logger");
const userModel = require("../../models/user");
const jwt = require("jsonwebtoken");
const encPassword = require("../../helper/encPassword");

async function resetPasswordValidation(req, res, next) {
  const user = req.user;

  const { oldpassword, newpassword } = req.body;

  if ((!oldpassword, !newpassword)) {
    logger.log({
      level: "info",
      message: await failureTemplate(400, "invalid request body"),
    });
    return res
      .status(400)
      .json(await failureTemplate(400, "invalid request body"));
  }

  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
  if (!passwordRegex.test(oldpassword) || !passwordRegex.test(newpassword)) {
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
  if (newpassword === oldpassword) {
    logger.log({
      level: "info",
      message: await failureTemplate(
        400,
        "New Password cannot be same as Old Password"
      ),
    });
    return res
      .status(400)
      .json(
        await failureTemplate(
          400,
          "New Password cannot be same as Old Password"
        )
      );
  }

  const findUser = await userModel.findById(user._id);

  const storeHash = findUser.password;

  const checkUser = await encPassword("compare", oldpassword, storeHash);

  if (checkUser == false) {
    logger.log({
      level: "info",
      message: await failureTemplate(400, "Invalid old password"),
    });

    return res
      .status(400)
      .json(await failureTemplate(400, "Invalid old password"));
  }

  next();
}

module.exports = resetPasswordValidation;
