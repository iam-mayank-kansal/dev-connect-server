const logger = require("../../helper/logger");
const { failureTemplate } = require("../../helper/template");
const OTPModel = require("../../models/otp");
const userModel = require("../../models/user");
const OTP_LENGTH = process.env.OTP_LENGTH || 6;

async function verifyOtpValidation(req, res, next) {
    const { email, otp } = req.body;

    if (!email || !otp) {
        logger.log({
            level: "info",
            message: await failureTemplate(400, "invalid request body: email and otp are required."),
        });
        return res.status(400).json(await failureTemplate(400, "invalid request body: email and otp are required."));
    }

    const emailRegex = /^[A-Za-z0-9._%+-]{6,}@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    if (!emailRegex.test(email)) {
        logger.log({
            level: "info",
            message: await failureTemplate(400, "Enter Valid Email"),
        });
        return res.status(400).json(await failureTemplate(400, "Enter Valid Email"));
    }

    const otpRegex = new RegExp(`^\\d{${OTP_LENGTH}}$`);
    if (!otpRegex.test(otp)) {
        logger.log({
            level: "info",
            message: await failureTemplate(400, `OTP must be a ${OTP_LENGTH}-digit number.`),
        });
        return res.status(400).json(await failureTemplate(400, `OTP must be a ${OTP_LENGTH}-digit number.`));
    }

    const findUser = await userModel.findOne({ email: email });

    if (!findUser) {
        logger.log({
            level: "info",
            message: await failureTemplate(
                400,
                "User does not exist! Request from Unregistered User"
            ),
        });
        return res.status(400).json(
            await failureTemplate(
                400,
                "User does not exist! Request from Unregistered User"
            )
        );
    }
    
    const findOtp = await OTPModel.findOne({ email: email, otp: otp });

    if (!findOtp) {
        logger.log({
            level: "info",
            message: await failureTemplate(400, "Invalid OTP"),
        });
        return res.status(400).json(await failureTemplate(400, "Invalid OTP"));
    }

    const date = new Date();
    if (findOtp.expiringTime < date || findOtp.status !== "pending") {
        logger.log({
            level: "info",
            message: await failureTemplate(400, "Invalid OTP or OTP Expired"),
        });
        return res.status(400).json(await failureTemplate(400, "Invalid OTP or OTP Expired"));
    }

    logger.log({
        level: "info",
        message: `OTP Verification Validation Successful`,
    });

    req.otpDetails = findOtp; 
    next();
}

module.exports = verifyOtpValidation;