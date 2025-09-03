const crypto = require("crypto");

function generateOtp(length = 6) {
  if (length <= 0) {
    throw new Error("OTP length must be a positive integer.");
  }
  const min = Math.pow(10, length - 1);
  const max = Math.pow(10, length) - 1;
  const otp = crypto.randomInt(min, max + 1);
  return otp.toString();
}

module.exports = generateOtp;


