import express from "express";
const userConnectionRouter = express.Router();

// Auth Middleware
import authRoute from "../middleware/auth";

// --- Validators ---
import sendConnectionValidation from "../validators/userConnection/sendConnectionRequestValidation";
import suspendConnectionValidation from "../validators/userConnection/suspendConnectionValidation";
import blockUserValidation from "../validators/userConnection/blockUserValidation";
import unblockUserValidation from "../validators/userConnection/unblockUserValidation";
import ignoreUserValidation from "../validators/userConnection/ignoreUserValidation";
import unignoreUserValidation from "../validators/userConnection/unignoreUserValidation";

// --- Controllers ---
import sendConnection from "../controllers/userConnection/sendConnectionRequest";
import suspendConnection from "../controllers/userConnection/suspendConnectionRequest";
import connectionResponse from "../controllers/userConnection/connectionResponse";
import deleteConnection from "../controllers/userConnection/deleteConnection";
import getUserConnections from "../controllers/userConnection/getUserConnections";
import findConnection from "../controllers/userConnection/findConnection";
import blockUser from "../controllers/userConnection/blockUser";
import unblockUser from "../controllers/userConnection/unblockUser";
import ignoreUser from "../controllers/userConnection/ignoreUser";
import unignoreUser from "../controllers/userConnection/unignoreUser";
import connectionResponseValidation from "../validators/userConnection/connectionResponseValidation";
import deleteConnectionValidation from "../validators/userConnection/deleteConnectionValidation";

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

export default userConnectionRouter;
