const express = require("express");
const userRouter = express.Router();
const uploadStore = require("../helper/upload");
//auth middleware
const authRoute = require("../middleware/auth");

//user imports
const deleteUser = require("../controllers/user/delete");
const updateUserValidation = require("../validators/user/updateUserValidator");
const updateUser = require("../controllers/user/updateUser");
const handleMulter = require("../helper/uploadErrorHandler");
const getPublicProfile = require("../controllers/user/getPublicProfile");
const searchUsers = require("../controllers/user/searchUsers");
const deleteValidation = require("../validators/user/deleteValidator");

//middleware for image uploading
const upload = uploadStore();

//user routes
userRouter.get("/profile/:userId", authRoute, getPublicProfile);
userRouter.get("/search", searchUsers);
userRouter.delete("/delete", authRoute, deleteValidation, deleteUser);
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

module.exports = userRouter;
