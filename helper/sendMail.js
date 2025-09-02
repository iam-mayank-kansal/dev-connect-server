const nodemailer = require("nodemailer");
const otpTemplate = require("../utils/otpTemplate");
const logger = require("./logger");
const dotenv = require("dotenv");
dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

async function shipOTP(otp, receiver, type) {
  if (type == "email") {
    const info = await transporter.sendMail({
      from: `"Devconnect" <${process.env.GMAIL_USER}>`,
      to: receiver,
      subject: "🔒 OTP Verification for Password Reset",
      html: otpTemplate({
        otp,
        title: "OTP Verification for Password Reset",
        message:
          "We received a request to reset your password. Use the OTP below to proceed:",
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

module.exports = shipOTP;
