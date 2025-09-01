const generateOTP = require("../../helper/generateOtp");
const sendOtp = require("../../helper/sendMail");

async function forgetPassword(req, res) {
    const user = req.user;
    const generatedOtp = generateOTP();

    try {
        if (user.email != null) 
        {
            await sendOtp(generatedOtp, user.email, 'email');
            return res.status(200).json(await otpSentTemplate(user.email));
        } 
        else if (user.mobile != null) 
        {
            await sendOtp(generatedOtp, user.mobile, 'mobile');
            return res.status(200).json(await otpSentTemplate(user.mobile));
        }
        // No valid contact found (fallback)
        return res.status(400).json(await failureTemplate(400, "No valid contact info for user"));
    } 
    catch (err) 
    {
        return res.status(500).json(await failureTemplate(500, "Failed to send OTP"));
    }
}


module.exports = forgetPassword;