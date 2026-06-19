import express from "express";
const userBlogRouter = express.Router();

//auth middleware
import authRoute from "../middleware/auth";

//user imports
import createBlogValidation from "../validators/userBlog/createBlogValidation";
import createBlog from "../controllers/userBlog/createBlog";
import fetchBlogs from "../controllers/userBlog/fetchBlogs";
import fetchUserBlogs from "../controllers/userBlog/fetchUserBlogs";
import fetchBlogById from "../controllers/userBlog/fetchBlogById";
import editBlogValidation from "../validators/userBlog/editBlogValidation";
import editBlog from "../controllers/userBlog/editBlog";
import deleteBlogValidation from "../validators/userBlog/deleteBlogValidation";
import deleteBlog from "../controllers/userBlog/deleteBlog";
import reactBlogValidation from "../validators/userBlog/reactBlogValidation";
import reactBlog from "../controllers/userBlog/reactBlog";

//user blog routes
userBlogRouter.post(
  "/create-blog",
  authRoute,
  createBlogValidation,
  createBlog
);

// fetch all blogs with pagination and limit
userBlogRouter.get("/fetch-blogs", authRoute, fetchBlogs);

// fetch all blogs by a particular user with pagination and limit
userBlogRouter.get("/fetch-user-blogs/:userId", authRoute, fetchUserBlogs);

// fetch a particular blog by blog id
userBlogRouter.get("/fetch-blog/:blogId", authRoute, fetchBlogById);

userBlogRouter.patch("/edit-blog", authRoute, editBlogValidation, editBlog);
userBlogRouter.patch(
  "/delete-blog",
  authRoute,
  deleteBlogValidation,
  deleteBlog
);
userBlogRouter.put("/react-blog", authRoute, reactBlogValidation, reactBlog);

export default userBlogRouter;
