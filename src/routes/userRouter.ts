import express from "express";
const userRouter = express.Router();

//auth middleware
import authRoute from "../middleware/auth";

//user imports
import deleteUser from "../controllers/user/delete";
import updateUserValidation from "../validators/user/updateUserValidator";
import updateUser from "../controllers/user/updateUser";
import getPublicProfile from "../controllers/user/getPublicProfile";
import searchUsers from "../controllers/user/searchUsers";
import deleteValidation from "../validators/user/deleteValidator";

//user routes
userRouter.get("/profile/:userId", authRoute, getPublicProfile);
userRouter.get("/search", authRoute, searchUsers);
userRouter.delete("/delete", authRoute, deleteValidation, deleteUser);
userRouter.patch("/update-user", authRoute, updateUserValidation, updateUser);

export default userRouter;
