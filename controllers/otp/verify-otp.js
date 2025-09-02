const logger = require("../../helper/logger");
const crypto = require("crypto");
const userModel = require("../../models/user");

async function verifyOTP(req, res) {
  const otpDbDetail = req.otpDetails;
  try {
    otpDbDetail.status = "verified";
    await otpDbDetail.save();

    const resetToken = crypto.randomBytes(32).toString("hex");
    const user = await userModel.findOne({ email: otpDbDetail.email });
    user.resetToken = resetToken;
    user.resetTokenExpiry = new Date(Date.now() + 5 * 60000);
    await user.save();

    logger.log({
      level: "info",
      message: "User Verified Successfully",
    });

    return res.status(200).json({
      status: 200,
      message:
        "OTP verified successfully. Use the provided token to set a new password.",
      data: {
        token: resetToken,
        contact: user.email,
      },
    });
  } catch (error) {
    logger.log({
      level: "error",
      message: `Failed to verify OTP: ${error.message}`,
    });
    return res.status(500).json({
      status: 500,
      message: "Failed to verify OTP.",
    });
  }
}

module.exports = verifyOTP;
