const express = require("express");
const sendOTP = require("../controllers/otp/send-otp");
const verifyOtpValidation = require("../validators/otp/verifyOtpValidation");
const verifyOTP = require("../controllers/otp/verify-otp");
const sendOtpValidation = require("../validators/otp/sendOtpValidation");

const otpRouter = express.Router();

otpRouter.post("/send-otp", sendOtpValidation, sendOTP);
otpRouter.post("/verify-otp", verifyOtpValidation, verifyOTP);

module.exports = otpRouter;