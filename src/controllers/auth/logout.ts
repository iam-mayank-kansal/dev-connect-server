import logger from "@/helper/logger";
import { successTemplate } from "@/helper/template";
import type { Request, Response } from "express";

async function logout(req: Request, res: Response) {
  const isProduction = process.env.NODE_ENV === "production";

  res.clearCookie("devconnect-auth-token", {
    httpOnly: true,
    secure: isProduction ? true : false,
    sameSite: isProduction ? "none" : "lax",
    path: "/",
  });
  logger.log({
    level: "info",
    message: "User logged out successfully",
    status: successTemplate(201, "user logged out successfully"),
  });
  res.status(200).json(successTemplate(201, "user logged out successfully"));
}

export default logout;
