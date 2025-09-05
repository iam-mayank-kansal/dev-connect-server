const express = require("express");
const userRouter = express.Router();
const uploadStore = require("../helper/upload");
//auth middleware
const authRoute = require("../middleware/auth");

//user imports
const delteValidation = require("../validators/user/deleteValidator");
const deleteUser = require("../controllers/user/delete");
const resetPasswordValidation = require("../validators/user/resetPasswordValidator");
const resetPassword = require("../controllers/user/resetPassword");
const updateUserValidation = require("../validators/user/updateUserValidator");
const updateUser = require("../controllers/user/updateUser");
const setNewPasswordValidation = require("../validators/user/setNewPasswordValidation");
const setNewPassword = require("../controllers/user/setNewPassword");
const displayUser = require("../controllers/user/displayUserProfile");
const handleMulter = require("../helper/uploadErrorHandler");

//middleware for image uploading
const upload = uploadStore();

//user routes
userRouter.get("/profile", authRoute, displayUser);
userRouter.delete("/delete", authRoute, delteValidation, deleteUser);
userRouter.patch(
  "/update-user",
  authRoute,
  handleMulter(
    upload.fields([
      { name: "profilePicture", maxCount: 1 },
      { name: "resume", maxCount: 1 },
    ])
  ),
  updateUserValidation,
  updateUser
);
userRouter.patch(
  "/reset-password",
  authRoute,
  resetPasswordValidation,
  resetPassword
);
userRouter.patch("/set-new-password", setNewPasswordValidation, setNewPassword);

module.exports = userRouter;
