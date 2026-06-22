import nodemailer from "nodemailer";
import dotenv from "dotenv";
import logger from "@/helper/logger";
import dotenvConfig from "@/config/dotenv.config";
import otpTemplate from "@/utils/otpTemplate";
dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: dotenvConfig.GMAIL_USER?.trim(),
    pass: dotenvConfig.GMAIL_PASS?.trim(),
  },
});

async function shipOTP(otp: string, receiver: string, type: string) {
  if (type == "email") {
    const info = await transporter.sendMail({
      from: `"Devconnect" <${dotenvConfig.GMAIL_USER}>`,
      to: receiver,
      subject: "🔒 OTP Verification for Password Reset",
      html: otpTemplate({
        otp,
        title: "OTP Verification for Password Reset",
        message:
          "We've received a request to reset your password. Use the OTP below to proceed:",
      }),
    });

    logger.log({
      level: "info",
      message: "OTP on mail sent Successfully",
      messageId: info.messageId,
    });
  } else if (type == "mobile") {
    logger.log({
      level: "info",
      message: "OTP on mobile service under construction",
    });
  }
}

export default shipOTP;
