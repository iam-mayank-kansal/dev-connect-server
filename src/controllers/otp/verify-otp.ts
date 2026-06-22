import crypto from "crypto";
import logger from "@/helper/logger";
import { userModel } from "@/models/user.model";
import type { Request, Response } from "express";

async function verifyOTP(req: Request, res: Response) {
  const otpDbDetail = req.otpDetails;
  if (!otpDbDetail) {
    return res
      .status(400)
      .json({ status: 400, message: "OTP details not found." });
  }

  try {
    (otpDbDetail as any).status = "verified";
    await (otpDbDetail as any).save();

    const resetToken = crypto.randomBytes(32).toString("hex");
    const user = await userModel.findOne({ email: otpDbDetail.email });
    if (!user) {
      return res.status(404).json({ status: 404, message: "User not found." });
    }
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
  } catch (error: unknown) {
    const err = error as Error;
    logger.log({
      level: "error",
      message: `Failed to verify OTP: ${err.message}`,
    });
    return res.status(500).json({
      status: 500,
      message: "Failed to verify OTP.",
    });
  }
}

export default verifyOTP;
