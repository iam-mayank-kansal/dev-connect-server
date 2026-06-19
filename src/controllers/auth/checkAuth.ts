import type { Request, Response } from "express";
import { successTemplate } from "../../helper/template.js";

async function checkAuth(req : Request, res : Response) {
  const user = req.user;
  res
    .status(201)
    .json(successTemplate(201, `user successfully Autheticated`, user));
}

export default checkAuth;
