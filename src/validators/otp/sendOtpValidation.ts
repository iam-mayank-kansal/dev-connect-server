import logger from "@/helper/logger";
import { userModel } from "@/models/user.model";
import { failureTemplate } from "@/helper/template";
import type { Request, Response, NextFunction } from "express";
import { emailRegex, mobileRegex } from "@/utils/regex";

async function sendOtpValidation(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { email, mobile } = req.body;

  const query: any = {};
  if (email) query.email = email;
  if (mobile) query.mobile = mobile;

  if (!(email || mobile)) {
    logger.log({
      level: "info",
      message: "Invalid request body: No email or mobile provided",
      status: failureTemplate(400, "invalid request body"),
    });
    return res.status(400).json(failureTemplate(400, "invalid request body"));
  }

  if (email && !emailRegex.test(email)) {
    logger.log({
      level: "info",
      message: "Enter Valid Email",
      status: failureTemplate(400, "Enter Valid Email"),
    });
    return res.status(400).json(failureTemplate(400, "Enter Valid Email"));
  }

  if (mobile && !mobileRegex.test(mobile)) {
    logger.log({
      level: "info",
      message: "Enter Valid Mobile Number",
      status: failureTemplate(400, "Enter Valid Mobile Number"),
    });
    return res
      .status(400)
      .json(failureTemplate(400, "Enter Valid Mobile Number"));
  }

  const findUser = await userModel.findOne(query);

  if (!findUser) {
    logger.log({
      level: "info",

      message:
        "User does not exist! Kindly contact administrator for registration",
      status: failureTemplate(
        400,
        "User does not exist! Kindly contact administrator for registration"
      ),
    });
    return res
      .status(400)
      .json(
        failureTemplate(
          400,
          "User does not exist! Kindly contact administrator for registration"
        )
      );
  }

  req.user = {
    _id: findUser._id,
    name: findUser.name,
    email: findUser.email,
    mobile: query.mobile ? query.mobile : undefined,
    otpType: query.email ? "email" : "mobile",
  };

  next();
}

export default sendOtpValidation;
