import { userModel } from "@/models/user.model";
import logger from "../../helper/logger";
import { successTemplate } from "../../helper/template";
import type { Request, Response } from "express";
import encPassword from "@/helper/encPassword";

async function setNewPassword(req: Request, res: Response) {
  const { user, newPassword } = req.details!;

  try {
    const hashedPassword = await encPassword("generate", newPassword);

    const updatedUser = await userModel.findByIdAndUpdate(
      user._id,
      {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
      },
      { new: true }
    );

    if (updatedUser) {
      const isProduction = process.env.NODE_ENV === "production";

      res.clearCookie("devconnect-auth-token", {
        httpOnly: true,
        secure: isProduction ? true : false,
        sameSite: isProduction ? "none" : "lax",
        path: "/",
      });
      logger.log({
        level: "info",
        message: `${updatedUser.name} user password reseted successfully`,
        status: successTemplate(
          201,
          `${updatedUser.name} user password reseted successfully`
        ),
      });

      return res
        .status(200)
        .json(
          successTemplate(
            201,
            `${updatedUser.name} user password reseted successfully`
          )
        );
    }
  } catch (error: any) {
    logger.log({
      level: "error",
      message: `Failed to update user password: ${error.message}`,
    });
    return res.status(500).json({
      status: 500,
      message: "Failed to update user password.",
    });
  }
}

export default setNewPassword;
