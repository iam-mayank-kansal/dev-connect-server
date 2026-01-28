const http = require("http");
const express = require("express");
const app = express();

const { Server } = require("socket.io");
const httpServer = new http.createServer(app);
const ioServer = new Server(httpServer, {
  cors: {
    origin: ["http://localhost:3000"],
  },
});

ioServer.on("connection", (socket) => {
  console.log(`A new User Connection with Socket ID : ${socket.id}`);

  socket.on("disconnect", () => {
    console.log(`A new User Disconnect with Socket ID : ${socket.id}`);
  });
});

module.exports = { ioServer, httpServer, app };
