import express from "express";
const authRouter = express.Router();

// auth middleware
import authRoute from "../middleware/auth";

//auth imports
import checkAuth from "../controllers/auth/checkAuth";
import signUpValidation from "../validators/auth/signUpValidator";
import signUp from "../controllers/auth/signUp";
import loginValidation from "../validators/auth/loginValidator";
import login from "../controllers/auth/login";
import logout from "@/controllers/auth/logout";
import setNewPasswordValidation from "@/validators/auth/setNewPasswordValidation";
import setNewPassword from "@/controllers/auth/setNewPassword";
import resetPasswordValidation from "@/validators/auth/resetPasswordValidator";
import resetPassword from "@/controllers/auth/resetPassword";
import getImageKitAuth from "@/controllers/auth/getImageKitAuth";
import deleteImageKitResource from "@/controllers/auth/deleteImageKitResource";

//auth routes
authRouter.get("/check-auth", authRoute, checkAuth);
authRouter.post("/sign-up", signUpValidation, signUp);
authRouter.post("/login", loginValidation, login);
authRouter.post("/logout", authRoute, logout);
authRouter.patch("/set-new-password", setNewPasswordValidation, setNewPassword);
authRouter.patch(
  "/reset-password",
  authRoute,
  resetPasswordValidation,
  resetPassword
);
authRouter.get("/imageKit-access", authRoute, getImageKitAuth);
authRouter.delete("/imagekit-delete", authRoute, deleteImageKitResource);

export default authRouter;
