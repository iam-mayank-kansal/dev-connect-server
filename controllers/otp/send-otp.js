const genrateOtp = require("../../helper/genrateOtp");
const logger = require("../../helper/logger");
const shipOTP = require("../../helper/sendMail");
const { otpSentTemplate, failureTemplate } = require("../../helper/template");
const OTPModel = require("../../models/otp");
const OTP_LENGTH = process.env.OTP_LENGTH || 6;

async function sendOTP(req, res, next) {
    const user = req.user;
    const otp = genrateOtp(OTP_LENGTH);

    try {
        const newOtp = new OTPModel({
            email: user?.email,
            mobile: user?.mobile,
            otp: otp,
            type: user?.email ? 'email' : 'mobile',
            expiringTime: new Date(Date.now() + 5 * 60000),
            status: "pending"
        });

        const mongooseResponse = await newOtp.save();
        logger.log({
            level: "info",
            message: mongooseResponse.message
        })

        if (user.otpType == 'email') {
            await shipOTP(otp, user.email, user.otpType);
            logger.log({
                level: "info",
                message: `OTP Sent Successfully to ${user.name} on email : ${user.email}`
            });
            return res.status(200).json(await otpSentTemplate(user.email));
        } else if (user.otpType == 'mobile') {
            await shipOTP(otp, user.mobile, user.otpType);
            logger.log({
                level: "info",
                message: `OTP Sent Successfully to ${user.name} on mobile : ${user.mobile}`
            });
            return res.status(200).json(await otpSentTemplate(user.mobile));
        } else {
            logger.log({
                level: "error",
                message: `Unspecified OTP type it could only be email or mobile`
            });
            return res.status(400).json(await failureTemplate(400, "No valid contact info for user"));
        }
    } catch (error) {
        logger.log({
            level: "error",
            message: `Failed to send OTP: ${error.message}`
        });
        return res.status(500).json(await failureTemplate(500, "Failed to send OTP"));
    }
}

module.exports = sendOTP;