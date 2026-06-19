import express from "express";
const messageRouter = express.Router();

// auth middleware
import authRoute from "../middleware/auth";

import getUsersForSlider from "../controllers/chat/getUsersForSlider";
import getConversationMessages from "../controllers/chat/getConversationMessages";
import sendMessage from "../controllers/chat/sendMessage";

messageRouter.get("/chats", authRoute, getUsersForSlider);
messageRouter.get("/conversation/:id", authRoute, getConversationMessages);
messageRouter.post("/send-message/:id", authRoute, sendMessage);

export default messageRouter;
