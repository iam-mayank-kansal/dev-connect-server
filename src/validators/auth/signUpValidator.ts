import type { Request, Response, NextFunction } from "express";
import { failureTemplate } from "../../helper/template";
import logger from "../../helper/logger";
import { userModel } from "../../models/user.model";
import { emailRegex, passwordRegex } from "@/utils/regex";

async function signUpValidation(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    logger.log({
      level: "info",
      message: "invalid request body",
      status: failureTemplate(400, "invalid request body"),
    });
    return res.status(400).json(failureTemplate(400, "invalid request body"));
  }


  if (!emailRegex.test(email)) {
    logger.log({
      level: "info",
      message: "Enter Valid Email",
      status: failureTemplate(400, "Enter Valid Email"),
    });
    return res.status(400).json(failureTemplate(400, "Enter Valid Email"));
  }


  if (!passwordRegex.test(password)) {
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
        failureTemplate(
          400,
          "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&)."
        )
      );
  }

  if (name.length < 3 || name.length > 20) {
    logger.log({
      level: "info",
      message: "Enter Valid Name",
      status: failureTemplate(400, "Enter Valid Name"),
    });
    return res.status(400).json(failureTemplate(400, "Enter Valid Name"));
  }

  const existingUser = await userModel.findOne({ email: email });
  if (existingUser) {
    logger.log({
      level: "info",
      message: "account already exists ! kindly use another email",
      status: failureTemplate(
        400,
        "account already exists ! kindly use another email"
      ),
    });
    return res
      .status(400)
      .json(
        failureTemplate(
          400,
          "account already exists ! kindly use another email"
        )
      );
  }

  logger.log({
    level: "info",
    message: "User signup Validation Success",
  });

  next();
}

export default signUpValidation;
