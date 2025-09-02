const express = require("express");
const authRouter = express.Router();

//auth imports
const signUpValidation = require("../validators/auth/signUpValidator");
const signUp = require("../controllers/auth/signUp");
const loginValidation = require("../validators/auth/loginValidator");
const login = require("../controllers/auth/login");
const logout = require("../controllers/auth/logOut");

//auth routes
authRouter.post("/sign-up", signUpValidation, signUp);
authRouter.post("/login", loginValidation, login);
authRouter.post("/logout", logout);

module.exports = authRouter;
