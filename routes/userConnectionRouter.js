const express = require("express");
const userConnectionRouter = express.Router();

// Auth Middleware
const authRoute = require("../middleware/auth");

// --- Validators ---
const sendConnectionValidation = require("../validators/userConnection/sendConnectionRequestValidation");
const suspendConnectionValidation = require("../validators/userConnection/suspendConnectionValidation");
const blockUserValidation = require("../validators/userConnection/blockUserValidation");
const unblockUserValidation = require("../validators/userConnection/unblockUserValidation");
const ignoreUserValidation = require("../validators/userConnection/ignoreUserValidation");
const unignoreUserValidation = require("../validators/userConnection/unignoreUserValidation");

// --- Controllers ---
const sendConnection = require("../controllers/userConnection/sendConnectionRequest");
const suspendConnection = require("../controllers/userConnection/suspendConnectionRequest");
const connectionResponse = require("../controllers/userConnection/connectionResponse");
const deleteConnection = require("../controllers/userConnection/deleteConnection");
const getUserConnections = require("../controllers/userConnection/getUserConnections");
const findConnection = require("../controllers/userConnection/findConnection");
const blockUser = require("../controllers/userConnection/blockUser");
const unblockUser = require("../controllers/userConnection/unblockUser");
const ignoreUser = require("../controllers/userConnection/ignoreUser");
const unignoreUser = require("../controllers/userConnection/unignoreUser");
const connectionResponseValidation = require("../validators/userConnection/connectionResponseValidation");
const deleteConnectionValidation = require("../validators/userConnection/deleteConnectionValidation");

// 1. Connection Requests (Creation / Cancellation)
userConnectionRouter.post(
  "/send-connection-request",
  authRoute,
  sendConnectionValidation,
  sendConnection
);
userConnectionRouter.delete(
  "/suspend-connection-request",
  authRoute,
  suspendConnectionValidation,
  suspendConnection
);

// 2. Response (Accept / Reject)
userConnectionRouter.post(
  "/connection-response",
  authRoute,
  connectionResponseValidation,
  connectionResponse
);

// 3. Connection Management (Unfriend)
userConnectionRouter.delete(
  "/delete-connection",
  authRoute,
  deleteConnectionValidation,
  deleteConnection
);

// 4. Blocking
userConnectionRouter.post(
  "/block-user",
  authRoute,
  blockUserValidation,
  blockUser
);
userConnectionRouter.post(
  "/unblock-user",
  authRoute,
  unblockUserValidation,
  unblockUser
);

// 5. Ignoring
userConnectionRouter.post(
  "/ignore-user",
  authRoute,
  ignoreUserValidation,
  ignoreUser
);
userConnectionRouter.post(
  "/unignore-user",
  authRoute,
  unignoreUserValidation,
  unignoreUser
);

// 6. Getters
userConnectionRouter.get(
  "/get-user-connections",
  authRoute,
  getUserConnections
);
userConnectionRouter.get("/find-connection", authRoute, findConnection);

module.exports = userConnectionRouter;
