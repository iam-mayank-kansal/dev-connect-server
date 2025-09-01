const { level } = require("winston");
const generateOTP = require("../../helper/generateOtp");
const logger = require("../../helper/logger");
const sendOtp = require("../../helper/sendMail");

async function sendOTP(req, res, next) {
    const user = req.user;

    const otp = await generateOTP();
    if (user.type == 'email') {
        await sendOtp(otp, user.email, user.type);
        logger({
            level: "info",
            message: `OTP Sent Successfully to ${user.name} on email : ${user.email}`
        })
    }
    else if (user.type == 'mobile') {
        await sendOtp(otp, user.mobile, user.type);
        logger({
            level: "info",
            message: `OTP Sent Successfully to ${user.name} on mobile : ${user.mobile}`
        })
    }
    else{
         logger({
            level: "error",
            message: `Unspecified OTP type it could only be email or mobile`
        })
    }

    next();
}

module.exports = sendOTP