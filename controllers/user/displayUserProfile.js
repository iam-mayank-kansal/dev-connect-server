const userModel = require("../../models/user");
const { displayUserTemplate } = require("../../helper/template");
const logger = require("../../helper/logger");
const cookie = require("cookie-parser");

async function displayUser(req, res) {
  const user = req.user;
  
  //  --> use while testing for get profile in browser and pass the id of document(form your mongo collection) u want to diplay
  // const findUser = await userModel.findById('68b447bd87e0730f3b3348a7');
  
  const findUser = await userModel.findById(user._id);
  logger.log({
    level: "info",
    action:"user displayed successfully",
    message: await displayUserTemplate(findUser),
  });
  res.status(201).json(await displayUserTemplate(findUser));
}

module.exports = displayUser;


