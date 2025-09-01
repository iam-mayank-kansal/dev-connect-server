const express = require("express");
const userRouter = express.Router();
const uploadedImageStore = require("../helper/uploadProfilePic");

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

//middleware for file uploading
const upload = uploadedImageStore()

//user routes
userRouter.delete("/delete", authRoute, delteValidation, deleteUser);
userRouter.patch("/reset-password", authRoute, resetPasswordValidation, resetPassword);
userRouter.patch("/update-user", authRoute, upload.single("profilePic"), updateUserValidation, updateUser);
userRouter.patch("/reset-password", authRoute, resetPasswordValidation, resetPassword);
userRouter.patch("/set-new-password", setNewPasswordValidation, setNewPassword);

module.exports = userRouter;
