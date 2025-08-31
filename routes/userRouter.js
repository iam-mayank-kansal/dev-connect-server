const express = require("express");
const userRouter = express.Router();
const uploadProfilePic = require("../helper/uploadProfilePic");
//auth middleware
const authRoute = require("../middleware/auth");

//user imports
const delteValidation = require("../validators/user/deleteValidator");
const deleteUser = require("../controllers/user/delete");
const resetPasswordValidation = require("../validators/user/resetPasswordValidator");
const resetPassword = require("../controllers/user/resetPassword");
const updateUserValidation = require("../validators/user/updateUserValidator");
const updateUser = require("../controllers/user/updateUser");

//user routes
userRouter.delete("/delete", authRoute, delteValidation, deleteUser);
userRouter.patch(
  "/reset-password",
  authRoute,
  resetPasswordValidation,
  resetPassword
);
userRouter.patch(
  "/update-user",
  authRoute,
  uploadProfilePic("profilePic"),
  updateUserValidation,
  updateUser
);

module.exports = userRouter;
