const express = require("express");
const authRoute = require("../middleware/auth");
const messageRouter = express.Router();

const getUsersForSlider = require("../controllers/chat/getUsersForSlider");
const getConversationMessages = require("../controllers/chat/getConversationMessages");
const sendMessage = require("../controllers/chat/sendMessage");

messageRouter.get("/chats", authRoute, getUsersForSlider);
messageRouter.get("/conversation/:id", authRoute, getConversationMessages);
messageRouter.post("/send-message/:id", authRoute, sendMessage);

module.exports = messageRouter;
