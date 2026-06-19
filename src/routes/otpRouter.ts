import express from "express";
const otpRouter = express.Router();

import sendOTP from "../controllers/otp/send-otp";
import verifyOtpValidation from "../validators/otp/verifyOtpValidation";
import verifyOTP from "../controllers/otp/verify-otp";
import sendOtpValidation from "../validators/otp/sendOtpValidation";

otpRouter.post("/send-otp", sendOtpValidation, sendOTP);
otpRouter.post("/verify-otp", verifyOtpValidation, verifyOTP);

export default otpRouter;
