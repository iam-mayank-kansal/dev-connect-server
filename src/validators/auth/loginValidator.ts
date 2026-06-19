import logger from "../../helper/logger";
import { failureTemplate } from "@/helper/template";
import { userModel } from "@/models/user.model";
import encPassword from "@/helper/encPassword";

import type { Request, Response, NextFunction } from "express";

async function loginValidation(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { email, password } = req.body;
  if (!email || !password) {
    logger.log({
      level: "info",
      message: "Invalid request body",
      status: failureTemplate(400, "invalid request body"),
    });
    return res.status(400).json(failureTemplate(400, "invalid request body"));
  }

  const emailRegex = /^[A-Za-z0-9._%+-]{6,}@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
  if (!emailRegex.test(email)) {
    logger.log({
      level: "info",
      message: "Enter Valid Email",
      status: failureTemplate(400, "Enter Valid Email"),
    });
    return res.status(400).json(failureTemplate(400, "Enter Valid Email"));
  }

  const findUser = await userModel.findOne({ email: email });

  if (findUser == null) {
    logger.log({
      level: "info",
      message:
        "User does not exists! kindly contact adminitrator for registration",
      status: failureTemplate(
        400,
        "User does not exists! kindly contact adminitrator for registration"
      ),
    });

    return res
      .status(400)
      .json(
        failureTemplate(
          400,
          "User does not exists! kindly contact adminitrator for registration"
        )
      );
  }

  const storeHash = findUser.password;

  const checkUser = await encPassword("compare", password, storeHash);

  if (checkUser == false) {
    logger.log({
      level: "info",
      message: "Invalid password",
      status: failureTemplate(400, "Invalid password"),
    });

    return res.status(400).json(failureTemplate(400, "Invalid password"));
  }

  logger.log({
    level: "info",
    message: "User Login Validation Success",
  });

  req.user = {
    _id: findUser._id,
    name: findUser.name,
    email: findUser.email,
  };

  if (findUser?.profilePicture) {
    req.user.profilePicture = findUser.profilePicture;
  }

  next();
}

export default loginValidation;
