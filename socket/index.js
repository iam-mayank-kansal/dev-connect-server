const http = require("http");
const express = require("express");
const app = express();

const { Server } = require("socket.io");
const httpServer = new http.createServer(app);
const ioServer = new Server(httpServer, {
  cors: {
    origin: [process.env.CLIENT_URL],
  },
});

const userSocketMap = {}; // {userId : socketId}

function getSocketIdByUserId(userId) {
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

module.exports = { ioServer, httpServer, app, getSocketIdByUserId };
