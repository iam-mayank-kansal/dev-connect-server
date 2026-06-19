import generateOtp from "@/helper/genrateOtp";
import logger from "@/helper/logger";
import shipOTP from "@/helper/sendMail";
const OTP_LENGTH = dotenvConfig.OTP_LENGTH || "6";
import dotenvConfig from "@/config/dotenv.config";
import { otpModel } from "@/models/otp.model";
import type { Request, Response } from "express";
import { failureTemplate, otpSentTemplate } from "@/helper/template";

async function sendOTP(req: Request, res: Response) {
  const user = req.user;
  const otp = generateOtp(OTP_LENGTH);

  try {
    const newOtp = new otpModel({
      email: user?.email,
      mobile: user?.mobile,
      otp: otp,
      type: user?.email ? "email" : "mobile",
      expiringTime: new Date(Date.now() + 5 * 60000),
      status: "pending",
    });

    await newOtp.save();

    logger.log({
      level: "info",
      message: "OTP saved successfully in the database",
    });

    if (user?.otpType == "email") {
      await shipOTP(otp, user.email, user.otpType);
      logger.log({
        level: "info",
        message: `OTP Sent Successfully to ${user.name} on email : ${user.email}`,
      });
      return res.status(200).json(otpSentTemplate(user.email));
    } else if (user?.otpType == "mobile") {
      if (!user.mobile) {
        logger.log({
          level: "error",
          message: `User ${user.name} does not have a mobile number for OTP`,
        });
        return res
          .status(400)
          .json(failureTemplate(400, "No mobile number for user"));
      }
      await shipOTP(otp, user?.mobile, user?.otpType);
      logger.log({
        level: "info",
        message: `OTP Sent Successfully to ${user.name} on mobile : ${user.mobile}`,
      });
      return res.status(200).json(otpSentTemplate(user.mobile));
    } else {
      logger.log({
        level: "error",
        message: `Unspecified OTP type it could only be email or mobile`,
      });
      return res
        .status(400)
        .json(failureTemplate(400, "No valid contact info for user"));
    }
  } catch (error: any) {
    logger.log({
      level: "error",
      message: `Failed to send OTP: ${error.message}`,
    });
    return res.status(500).json(failureTemplate(500, "Failed to send OTP"));
  }
}

export default sendOTP;
