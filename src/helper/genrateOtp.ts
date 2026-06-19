import crypto from "crypto";
import logger from "@/helper/logger";

function generateOtp(length = " 6"): string {
  const parsedLength = parseInt(length, 10);
  if (isNaN(parsedLength) || parsedLength <= 0) {
    throw new Error("OTP length must be a positive integer.");
  }
  if (parsedLength <= 0) {
    throw new Error("OTP length must be a positive integer.");
  }
  const min = Math.pow(10, parsedLength - 1);
  const max = Math.pow(10, parsedLength) - 1;
  const otp = crypto.randomInt(min, max + 1);

  logger.log({
    level: "info",
    message: `Generated OTP of length ${parsedLength}: ${otp}`,
    timestamp: new Date().toISOString(),
  });
  return otp.toString();
}

export default generateOtp;
