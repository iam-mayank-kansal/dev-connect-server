const { failureTemplate } = require("../../helper/template");
const logger = require("../../helper/logger");
const userModel = require("../../models/user");

async function setNewPasswordValidation(req, res, next) {
    const { resetToken, newPassword } = req.body;

    if (!resetToken || !newPassword) {
        logger.log({
            level: "info",
            message: await failureTemplate(400, "Invalid request body: resetToken and newPassword are required."),
        });
        return res.status(400).json(await failureTemplate(400, "Invalid request body: resetToken and newPassword are required."));
    }

    const passwordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
    if (!passwordRegex.test(newPassword)) {
        logger.log({
            level: "info",
            message: await failureTemplate(
                400,
                "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&)."
            ),
        });
        return res.status(400).json(
            await failureTemplate(
                400,
                "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&)."
            )
        );
    }

    const findUser = await userModel.findOne({
        resetToken: resetToken,
        resetTokenExpiry: { $gt: new Date() }
    });

    if (!findUser) {
        logger.log({
            level: "info",
            message: "Invalid or expired token provided for password reset."
        });
        return res.status(400).json({ status: 400, message: "Invalid or expired token." });
    }

    req.details = {
        user: findUser,
        newPassword: newPassword,
    };
    
    next();
}

module.exports = setNewPasswordValidation;