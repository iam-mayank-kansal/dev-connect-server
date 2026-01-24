const { successTemplate } = require("../../helper/template");

async function checkAuth(req, res) {
  const user = req.user;
  res
    .status(201)
    .json(successTemplate(201, `user successfully Autheticated`, user));
}

module.exports = checkAuth;
