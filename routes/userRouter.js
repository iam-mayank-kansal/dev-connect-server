const express = require("express");
const userRouter = express.Router();
//auth middleware
const authRoute = require("../middleware/auth");

//user imports
const deleteUser = require("../controllers/user/delete");
const updateUserValidation = require("../validators/user/updateUserValidator");
const updateUser = require("../controllers/user/updateUser");
const getPublicProfile = require("../controllers/user/getPublicProfile");
const searchUsers = require("../controllers/user/searchUsers");
const deleteValidation = require("../validators/user/deleteValidator");

//user routes
userRouter.get("/profile/:userId", authRoute, getPublicProfile);
userRouter.get("/search", authRoute, searchUsers);
userRouter.delete("/delete", authRoute, deleteValidation, deleteUser);
userRouter.patch("/update-user", authRoute, updateUserValidation, updateUser);

module.exports = userRouter;
