import http from "http";
import express from "express";
const app = express();

import { Server } from "socket.io";
const httpServer = http.createServer(app);
const ioServer = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST"],
  },
});

const userSocketMap = {}; // {userId : socketId}

function getSocketIdByUserId(userId: any) {
  return userSocketMap[userId];
}

ioServer.on("connection", (socket) => {
  console.log(`A new User Connection with Socket ID : ${socket.id}`);

  const userId = socket.handshake.query.userId;
  if (userId) {
    userSocketMap[userId] = socket.id;
  }

  console.log("Current User-Socket Map:", userSocketMap);
  ioServer.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    console.log(`A new User Disconnect with Socket ID : ${socket.id}`);
    if (userId) {
      delete userSocketMap[userId];
    }
    console.log("Updated User-Socket Map after disconnect:", userSocketMap);
    ioServer.emit("getOnlineUsers", userSocketMap);
  });
});

export { ioServer, httpServer, app, getSocketIdByUserId };
