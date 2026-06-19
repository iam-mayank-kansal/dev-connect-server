import { successTemplate } from "../../helper/template.js";

async function checkAuth(req, res) {
  const user = req.user;
  res
    .status(201)
    .json(successTemplate(201, `user successfully Autheticated`, user));
}

export default checkAuth;
