const userModel = require("../../models/user");
const encPassword = require("../../helper/encPassword");
const { successTemplate } = require("../../helper/template");
const logger = require("../../helper/logger");

async function signUp(req, res) {
  const { name, email, password } = req.body;
  const newUser = await userModel.create({
    name: name.trim(),
    email: email.trim(),
    password: await encPassword("genrate", password),
  });

  // if you only want certain fields returned
  const savedUser = await userModel
    .findById(newUser._id)
    .select("name email password -_id");

  logger.log({
    level: "info",
    message: await successTemplate(
      201,
      `${name} User created Successfully`,
      savedUser
    ),
  });
  return res
    .status(200)
    .json(
      await successTemplate(201, `${name} User created Successfully`, savedUser)
    );
}

module.exports = signUp;
