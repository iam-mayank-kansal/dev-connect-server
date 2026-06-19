import { userModel } from "@/models/user.model";
import logger from "@/helper/logger";
import { successTemplate, failureTemplate } from "@/helper/template";
import type { Request, Response } from "express";
import encPassword from "@/helper/encPassword";
import dotenvConfig from "@/config/dotenv.config";

async function resetPassword(req: Request, res: Response) {
  const user = req.user;
  const { newPassword } = req.body;

  const resetUserPassword = await userModel.findOneAndUpdate(
    { _id: user?._id },
    { password: await encPassword("genrate", newPassword) }
  );
  logger.log({
    level: "info",
    message: "User password updated successfully",
    status: successTemplate(
      201,
      `${resetUserPassword?.name} user password updated successfully`
    ),
  });

  const isProduction = dotenvConfig.NODE_ENV === "production";

  res.clearCookie("devconnect-auth-token", {
    httpOnly: true,
    secure: isProduction ? true : false,
    sameSite: isProduction ? "none" : "lax",
    path: "/",
  });
  res
    .status(201)
    .json(
      successTemplate(
        201,
        `${resetUserPassword?.name} user password updated successfully`
      )
    );
}

export default resetPassword;
