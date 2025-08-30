const jwt = require("jsonwebtoken");
const userModel = require("../../models/user");
const encPassword = require("../../helper/encPassword");
const { loginUserTemplate } = require("../../helper/template");
const logger = require("../../helper/logger");

async function login(req, res) {
  let { email, password } = req.body;
  email = email.trim();
  password = password.trim();

  const findUser = await userModel.findOne({ email: email });
  const storeHash = await findUser.password;
  const checkUser = await encPassword("compare", password, storeHash);
  if (checkUser == true) {
    const checkUser = await userModel.findOne({ email: email });
    //creating jwt token on successful login
    const payload = checkUser._id.toString();
    const token = jwt.sign({ payload }, process.env.SECRETKEY, {
      expiresIn: "1h",
    });
    res.cookie("devConnect", token, { httpOnly: true, secure: false });
    logger.log({
      level: "info",
      message: await loginUserTemplate(checkUser, checkUser.name),
      jwtToken: token,
    });
    res.status(201).json(await loginUserTemplate(checkUser, checkUser.name));
  }
}

module.exports = login;
