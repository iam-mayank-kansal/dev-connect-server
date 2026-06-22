import { failureTemplate } from "@/helper/template";
import logger from "@/helper/logger";
import { userModel } from "@/models/user.model";
import encPassword from "@/helper/encPassword";
import type { Request, Response, NextFunction } from "express";

async function deleteValidation(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const user = req.user!;
    const { password } = req.body;
    if (!password) {
      logger.log({
        level: "info",
        message: JSON.stringify(failureTemplate(400, "invalid request body")),
      });
      return res.status(400).json(failureTemplate(400, "invalid request body"));
    }

    const findUser = await userModel.findById(user._id);

    if (findUser == null) {
      logger.log({
        level: "info",
        message: JSON.stringify(
          failureTemplate(
            400,
            "User does not exists! kindly contact administrator for registration"
          )
        ),
      });

      return res
        .status(400)
        .json(
          failureTemplate(
            400,
            "User does not exists! kindly contact administrator for registration"
          )
        );
    }

    const storeHash = findUser.password;

    const checkUser = await encPassword("compare", password, storeHash);

    if (checkUser == false) {
      logger.log({
        level: "info",
        message: JSON.stringify(failureTemplate(400, "Invalid password")),
      });

      return res.status(400).json(failureTemplate(400, "Invalid password"));
    }

    next();
  } catch (error: unknown) {
    const err = error as Error;
    logger.log({
      level: "error",
      message: `Error in deleteValidation: ${err.message}`,
    });
    return res.status(500).json(failureTemplate(500, "Internal Server Error"));
  }
}

export default deleteValidation;
