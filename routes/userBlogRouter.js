const express = require("express");
const userBlogRouter = express.Router();

//auth middleware
const authRoute = require("../middleware/auth");

//user imports
const createBlogValidation = require("../validators/userBlog/createBlogValidation");
const createBlog = require("../controllers/userBlog/createBlog");
const fetchBlogs = require("../controllers/userBlog/fetchBlogs");
const fetchUserBlogs = require("../controllers/userBlog/fetchUserBlogs");
const fetchBlogById = require("../controllers/userBlog/fetchBlogById");
const editBlogValidation = require("../validators/userBlog/editBlogValidation");
const editBlog = require("../controllers/userBlog/editBlog");
const deleteBlogValidation = require("../validators/userBlog/deleteBlogValidation");
const deleteBlog = require("../controllers/userBlog/deleteBlog");
const reactBlogValidation = require("../validators/userBlog/reactBlogValidation");
const reactBlog = require("../controllers/userBlog/reactBlog");

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
userBlogRouter.get("/fetch-blog/:blogId", fetchBlogById);

userBlogRouter.patch("/edit-blog", authRoute, editBlogValidation, editBlog);
userBlogRouter.patch(
  "/delete-blog",
  authRoute,
  deleteBlogValidation,
  deleteBlog
);
userBlogRouter.put("/react-blog", authRoute, reactBlogValidation, reactBlog);

module.exports = userBlogRouter;
