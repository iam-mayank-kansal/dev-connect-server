const crypto = require("crypto");

function genrateOtp(length = 6) {
  //genrate random bytes
  const buffer = crypto.randomBytes(length);
  // console.log('bufffer>>',buffer);

  //convert to numeric otp
  const otp = parseInt(buffer.toString("hex"), 16).toString().slice(0, length);
  return otp;
}

//to check this genrate otp fn
// console.log("Generated OTP >>>", genrateOtp(6));

module.exports = genrateOtp;
