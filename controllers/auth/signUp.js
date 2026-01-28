const userModel = require("../../models/user");
const encPassword = require("../../helper/encPassword");
const { successTemplate } = require("../../helper/template");
const logger = require("../../helper/logger");
const jwt = require("jsonwebtoken");

async function signUp(req, res) {
  const { name, email, password } = req.body;

  const newUser = await userModel.create({
    name: name.trim(),
    email: email.trim(),
    password: await encPassword("generate", password),
  });

  // if you only want certain fields returned
  const savedUser = await userModel
    .findById(newUser._id)
    .select("_id name email");

  //creating jwt token on successful signup
  const payload = {
    _id: savedUser._id,
    name: savedUser.name,
    email: savedUser.email,
  };

  const token = jwt.sign({ payload }, process.env.JWT_SECRET_KEY, {
    expiresIn: "5h",
  });

  res.cookie("devconnect-auth-token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Lax",
    maxAge: 5 * 60 * 60 * 1000, // 5 hours
  });

  logger.log({
    level: "info",
    message: successTemplate(
      201,
      `${payload.name} user Signed Up successfully`,
      payload
    ),
  });
  return res
    .status(200)
    .json(successTemplate(201, `${name} User created Successfully`, payload));
}

module.exports = signUp;
