const logger = require("../../helper/logger");
const { failureTemplate } = require("../../helper/template");
const userModel = require("../../models/user");

async function sendOtpValidation(req, res, next) {
    const { email, mobile } = req.body;

    const query = {};
    if (email) query.email = email;
    if (mobile) query.mobile = mobile;


    if (!(email || mobile)) {
        logger.log({
            level: "info",
            message: await failureTemplate(400, "invalid request body"),
        });
        return res.status(400).json(await failureTemplate(400, "invalid request body"));
    }

    const emailRegex = /^[A-Za-z0-9._%+-]{6,}@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    if (email && !emailRegex.test(email)) {
        logger.log({
            level: "info",
            message: await failureTemplate(400, "Enter Valid Email"),
        });
        return res.status(400).json(await failureTemplate(400, "Enter Valid Email"));
    }

    const mobileRegex = /^\d{10}$/;
    if (mobile && !mobileRegex.test(mobile)) {
        logger.log({
            level: "info",
            message: await failureTemplate(400, "Enter Valid Mobile Number"),
        });
        return res.status(400).json(await failureTemplate(400, "Enter Valid Mobile Number"));
    }

    const findUser = await userModel.findOne(query);

    if (!findUser) {
        logger.log({
            level: "info",
            message: await failureTemplate(
                400,
                "User does not exist! Kindly contact administrator for registration"
            ),
        });
        return res.status(400).json(
            await failureTemplate(
                400,
                "User does not exist! Kindly contact administrator for registration"
            )
        );
    }

    req.user = {
        name: findUser.name,
        email: query.email ? query.email : null,
        mobile: query.mobile ? query.mobile : null,
        otpType: query.email ? 'email' : 'mobile'
    }

    next();
}

module.exports = sendOtpValidation;
