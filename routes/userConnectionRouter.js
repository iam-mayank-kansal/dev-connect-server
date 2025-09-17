const express = require("express");
const userConnectionRouter = express.Router();

//auth middleware
const authRoute = require("../middleware/auth");

//user imports
const createConnectionValidation = require("../validators/userConnection/createConnectionValidation");
const  createConnection= require("../controllers/userConnection/createConnection");
const  acceptConnectionValidation= require("../validators/userConnection/acceptConnectionValidation");
const  acceptConnection= require("../controllers/userConnection/acceptConnection");
const  listConnectionValidation= require("../validators/userConnection/listConnectionValidation");
const  listConnection= require("../controllers/userConnection/listConnection");



//user connection routes
userConnectionRouter.post("/create-connection", authRoute, createConnectionValidation,createConnection);
userConnectionRouter.post("/accept-connection", authRoute, acceptConnectionValidation,acceptConnection);
userConnectionRouter.post("/list-connections", authRoute, listConnectionValidation,listConnection);


module.exports = userConnectionRouter;
