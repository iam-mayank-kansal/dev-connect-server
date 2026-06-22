import { userModel } from "@/models/user.model";
import { successTemplate } from "@/helper/template";
import logger from "@/helper/logger";
import type { Request, Response } from "express";

async function deleteUser(req: Request, res: Response) {
  const user = req.user!;

  const findUser = await userModel.findByIdAndDelete(user._id);
  logger.log({
    level: "info",
    message: JSON.stringify(
      successTemplate(201, `${findUser!.name} user deleted successfully`)
    ),
  });

  const isProduction = process.env.NODE_ENV === "production";

  res.clearCookie("devconnect-auth-token", {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    path: "/",
  });
  res
    .status(201)
    .json(successTemplate(201, `${findUser!.name} user deleted successfully`));
}

export default deleteUser;
