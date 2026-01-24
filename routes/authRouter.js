const express = require("express");
const authRouter = express.Router();

//auth imports
const signUpValidation = require("../validators/auth/signUpValidator");
const signUp = require("../controllers/auth/signUp");
const loginValidation = require("../validators/auth/loginValidator");
const login = require("../controllers/auth/login");
const logout = require("../controllers/auth/logout");
const checkAuth = require("../controllers/auth/checkAuth");
const authRoute = require("../middleware/auth");
const setNewPasswordValidation = require("../validators/auth/setNewPasswordValidation");
const setNewPassword = require("../controllers/auth/setNewPassword");
const resetPasswordValidation = require("../validators/auth/resetPasswordValidator");
const resetPassword = require("../controllers/auth/resetPassword");

//auth routes
authRouter.get("/check-auth", authRoute, checkAuth);
authRouter.post("/refresh-token", authRoute, checkAuth);
authRouter.post("/sign-up", signUpValidation, signUp);
authRouter.post("/login", loginValidation, login);
authRouter.post("/logout", logout);
authRouter.patch("/set-new-password", setNewPasswordValidation, setNewPassword);
authRouter.patch(
  "/reset-password",
  authRoute,
  resetPasswordValidation,
  resetPassword
);

module.exports = authRouter;
