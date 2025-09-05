const crypto = require("crypto");
const logger = require("./logger");

function generateOtp(length = 6) {
  if (length <= 0) {
    throw new Error("OTP length must be a positive integer.");
  }
  const min = Math.pow(10, length - 1);
  const max = Math.pow(10, length) - 1;
  const otp = crypto.randomInt(min, max + 1);

  logger.log({
    level: "info",
    message: `Generated OTP of length ${length}`,
    timestamp: new Date().toISOString(),
  });
  return otp.toString();
}

module.exports = generateOtp;
