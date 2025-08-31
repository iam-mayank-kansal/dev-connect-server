const express = require("express");
const userRouter = express.Router();

//auth middleware
const authRoute = require("../middleware/auth");

//user imports
const delteValidation = require("../validators/user/deleteValidator");
const deleteUser = require("../controllers/user/delete");
const resetPasswordValidation = require("../validators/user/resetPasswordValidator");
const resetPassword = require("../controllers/user/resetPassword");

//user routes
userRouter.delete("/delete", authRoute, delteValidation, deleteUser);
userRouter.patch(
  "/reset-password",
  authRoute,
  resetPasswordValidation,
  resetPassword
);

module.exports = userRouter;
