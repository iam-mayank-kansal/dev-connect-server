const express = require("express");
const userRouter = express.Router();

userRouter.get("/signup", signUpValidation, signUp);
userRouter.get("/login", loginValidation, login);
userRouter.get("/forget-password", forgetPasswordValidation, forgetPassword);

module.exports = userRouter;