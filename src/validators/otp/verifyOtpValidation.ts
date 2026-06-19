import dotenvConfig from "@/config/dotenv.config";
import logger from "@/helper/logger";
import { failureTemplate } from "@/helper/template";
import { otpModel } from "@/models/otp.model";
import { userModel } from "@/models/user.model";
import { emailRegex, otpRegex } from "@/utils/regex";
import type { Request, Response, NextFunction } from "express";

async function verifyOtpValidation(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { email, otp } = req.body;

  if (!email || !otp) {
    logger.log({
      level: "info",
      message: "Invalid request body: email and otp are required",
      status: failureTemplate(
        400,
        "invalid request body: email and otp are required."
      ),
    });
    return res
      .status(400)
      .json(
        failureTemplate(
          400,
          "invalid request body: email and otp are required."
        )
      );
  }

  if (!emailRegex.test(email)) {
    logger.log({
      level: "info",
      message: "Enter Valid Email",
      status: failureTemplate(400, "Enter Valid Email"),
    });
    return res.status(400).json(failureTemplate(400, "Enter Valid Email"));
  }

  if (!otpRegex.test(otp)) {
    logger.log({
      level: "info",
      message: `OTP must be a ${dotenvConfig.OTP_LENGTH}-digit number`,
      status: failureTemplate(
        400,
        `OTP must be a ${dotenvConfig.OTP_LENGTH}-digit number`
      ),
    });
    return res
      .status(400)
      .json(
        failureTemplate(
          400,
          `OTP must be a ${dotenvConfig.OTP_LENGTH}-digit number`
        )
      );
  }

  const findUser = await userModel.findOne({ email: email });

  if (!findUser) {
    logger.log({
      level: "info",
      message: "User does not exist! Request from Unregistered User",
      status: failureTemplate(
        400,
        "User does not exist! Request from Unregistered User"
      ),
    });
    return res
      .status(400)
      .json(
        failureTemplate(
          400,
          "User does not exist! Request from Unregistered User"
        )
      );
  }

  const findOtp = await otpModel.findOne({ email: email, otp: otp });

  if (!findOtp) {
    logger.log({
      level: "info",
      message: "Invalid OTP",
      status: failureTemplate(400, "Invalid OTP"),
    });
    return res.status(400).json(failureTemplate(400, "Invalid OTP"));
  }

  const date = new Date();
  if (findOtp.expiringTime < date || findOtp.status !== "pending") {
    logger.log({
      level: "info",
      message: "Invalid OTP or OTP Expired",
      status: failureTemplate(400, "Invalid OTP or OTP Expired"),
    });
    return res
      .status(400)
      .json(failureTemplate(400, "Invalid OTP or OTP Expired"));
  }

  logger.log({
    level: "info",
    message: `OTP Verification Validation Successful`,
  });

  req.otpDetails = findOtp;
  next();
}

export default verifyOtpValidation;
