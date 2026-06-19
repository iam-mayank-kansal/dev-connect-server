import logger from "@/helper/logger";
import { failureTemplate } from "@/helper/template";
import { userModel } from "@/models/user.model";
import { passwordRegex } from "@/utils/regex";
import type { Request, Response, NextFunction } from "express";

async function setNewPasswordValidation(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { resetToken, newPassword } = req.body;

  if (!resetToken || !newPassword) {
    logger.log({
      level: "info",
      message: "Invalid request body: resetToken and newPassword are required.",
      status: failureTemplate(
        400,
        "Invalid request body: resetToken and newPassword are required."
      ),
    });
    return res
      .status(400)
      .json(
        failureTemplate(
          400,
          "Invalid request body: resetToken and newPassword are required."
        )
      );
  }

  if (!passwordRegex.test(newPassword)) {
    logger.log({
      level: "info",
      message:
        "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&).",
      status: failureTemplate(
        400,
        "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&)."
      ),
    });
    return res
      .status(400)
      .json(
        await failureTemplate(
          400,
          "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&)."
        )
      );
  }

  const findUser = await userModel.findOne({
    resetToken: resetToken,
    resetTokenExpiry: { $gt: new Date() },
  });

  if (!findUser) {
    logger.log({
      level: "info",
      message: "Invalid or expired token provided for password reset.",
    });
    return res
      .status(400)
      .json({ status: 400, message: "Invalid or expired token." });
  }

  req.details = {
    user: findUser,
    newPassword: newPassword,
  };

  next();
}

export default setNewPasswordValidation;
