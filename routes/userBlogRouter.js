const express = require("express");
const userBlogRouter = express.Router();

//auth middleware
const authRoute = require("../middleware/auth");

//setting up multer
const uploadStore = require("../helper/upload");
const handleMulter = require("../helper/uploadErrorHandler");

//middleware for image/viedo uploading
const upload = uploadStore();

//user imports
const createBlogValidation = require("../validators/userBlog/createBlogValidation");
const createBlog = require("../controllers/userBlog/createBlog");
const listUserBlog = require("../controllers/userBlog/listUserBlog");
const listAllBlog = require("../controllers/userBlog/listAllBlog");
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
  handleMulter(
    upload.fields([
      { name: "contentPhoto", maxCount: 10 },
      { name: "contentViedo", maxCount: 2 },
    ])
  ),
  createBlogValidation,
  createBlog
);

// do  we really need both list user blogs and list all blogs routes ?  -----------------
// can't we merge both routes with a query param to differentiate ?  -----------------
userBlogRouter.get("/list-user-blogs", authRoute, listUserBlog);
userBlogRouter.get("/list-all-blogs", listAllBlog);
userBlogRouter.patch("/edit-blog", authRoute, editBlogValidation, editBlog);
userBlogRouter.patch(
  "/delete-blog",
  authRoute,
  deleteBlogValidation,
  deleteBlog
);
userBlogRouter.put("/react-blog", authRoute, reactBlogValidation, reactBlog);

module.exports = userBlogRouter;
