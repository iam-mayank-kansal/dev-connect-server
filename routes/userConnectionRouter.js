const express = require("express");
const userConnectionRouter = express.Router();

//auth middleware
const authRoute = require("../middleware/auth");

//user imports
const createConnectionValidation = require("../validators/userConnection/createConnectionValidation");
const  createConnection= require("../controllers/userConnection/createConnection");

//user connection routes
userConnectionRouter.post("/create-connection", authRoute, createConnectionValidation,createConnection);


module.exports = userConnectionRouter;
