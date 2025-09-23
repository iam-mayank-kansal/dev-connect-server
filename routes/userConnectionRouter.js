const express = require("express");
const userConnectionRouter = express.Router();

//auth middleware
const authRoute = require("../middleware/auth");

//user imports
const sendConnectionValidation = require("../validators/userConnection/send_connection_request_validation");
const sendConnection = require("../controllers/userConnection/send_Connection_Request");
const connectionResponseValidation = require("../validators/userConnection/accept_reject_connection_validation");
const connectionResponse = require("../controllers/userConnection/accept_reject_connection");
const blockConnectionValidation = require("../validators/userConnection/block_unblock_connection_validation");
const blockConnection = require("../controllers/userConnection/block_unblock_connection");
const ignoreConnectionValidation = require("../validators/userConnection/ignore_unignore_connection_validation");
const ignoreConnection = require("../controllers/userConnection/ignore_unignore_connection");
const getUserConnections = require("../controllers/userConnection/get_user_connections");

//user connection routes
userConnectionRouter.post(
  "/send-connection-request",
  authRoute,
  sendConnectionValidation,
  sendConnection
);
userConnectionRouter.post(
  "/connection-response",
  authRoute,
  connectionResponseValidation,
  connectionResponse
);
userConnectionRouter.post(
  "/block-unblock-connection-request",
  authRoute,
  blockConnectionValidation,
  blockConnection
);
userConnectionRouter.post(
  "/ignore-unignore-connection-request",
  authRoute,
  ignoreConnectionValidation,
  ignoreConnection
);

userConnectionRouter.get(
  "/get-user-connections",
  authRoute,
  getUserConnections
);

module.exports = userConnectionRouter;
