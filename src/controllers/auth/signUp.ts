import { userModel } from "../../models/user.model";
import jwt from "jsonwebtoken";
import { successTemplate } from "../../helper/template";
import logger from "../../helper/logger";
import type { Request, Response } from "express";
import encPassword from "../../helper/encPassword";
import dotenvConfig from "../../config/dotenv.config";
import type { CookieOptions } from "express";

async function signUp(req: Request, res: Response) {
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
    _id: savedUser?._id,
    name: savedUser?.name,
    email: savedUser?.email,
  };

  const token = jwt.sign({ payload }, dotenvConfig.JWT_SECRET_KEY, {
    expiresIn: "5h",
  });

  // For production on Render: must have secure: true and sameSite: "None"
  const isProduction = process.env.NODE_ENV === "production";
  const cookieMaxAge = 5 * 60 * 60 * 1000;

  const cookieOptions: CookieOptions = {
    httpOnly: true,
    secure: isProduction ? true : false,
    sameSite: isProduction ? "none" : "lax",
    maxAge: cookieMaxAge,
    path: "/",
  };

  res.cookie("devconnect-auth-token", token, cookieOptions);

  logger.log({
    level: "info",
    message: `${payload.name} user Signed Up successfully`,
    status: successTemplate(
      201,
      `${payload.name} user Signed Up successfully`,
      payload
    ),
  });
  return res
    .status(200)
    .json(successTemplate(201, `${name} User created Successfully`, payload));
}

export default signUp;
