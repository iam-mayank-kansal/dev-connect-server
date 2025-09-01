const express = require("express");
const sendOTP = require("../controllers/otp/send-otp");

const otpRouter = express.Router();

otpRouter.post("/send-otp", sendOTP);
otpRouter.post("/verify-otp", verifyOtpValidation, verifyOtp);

module.exports = otpRouter;