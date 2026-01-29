// configuring dotenv in main file to use it across all over the project
const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const cors = require("cors");

// imports
const logger = require("./helper/logger");
const connectToDB = require("./config/database");
const cookieParser = require("cookie-parser");
const authRouter = require("./routes/authRouter");
const userRouter = require("./routes/userRouter");
const otpRouter = require("./routes/otpRouter");
const userConnectionRouter = require("./routes/userConnectionRouter");
const userBlogRouter = require("./routes/userBlogRouter");
const serverListenMessage = require("./helper/serverListenMessage");
const messageRouter = require("./routes/messageRouter");
const { app, httpServer } = require("./socket");

logger.log({
  level: "info",
  message: `Environment variables loaded and middleware starting...`,
  timestamp: new Date().toISOString(),
});

// Configure CORS to allow credentials (cookies) from client
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
logger.log({
  level: "info",
  message: `CORS configured to allow requests from ${process.env.CLIENT_URL} with credentials`,
  timestamp: new Date().toISOString(),
});

// some middleware for data transfers
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
logger.log({
  level: "info",
  message: `Middleware for JSON and URL-encoded data configured`,
  timestamp: new Date().toISOString(),
});

//routes ------------------------->
//auth routes
app.use("/devconnect/auth", authRouter);
//user routes
app.use("/devconnect/user", userRouter);
// otp routes
app.use("/devconnect/otp", otpRouter);
// user connection routes
app.use("/devconnect/userconnection", userConnectionRouter);
// user blog routes
app.use("/devconnect/blog", userBlogRouter);
// chat routes
app.use("/devconnect/message", messageRouter);

// listening to server if it's DB connection Successful
connectToDB()
  .then(() => {
    httpServer.listen(process.env.PORT, "0.0.0.0", () => {
      serverListenMessage();
      logger.log({
        level: "info",
        message: `Server Running Fine at ${process.env.ORIGIN_URL}`,
      });
    });
  })
  .catch((error) => {
    console.error("DB Connection Failed:", error);
    logger.log({
      level: "error",
      message: `DB Connection Failed`,
      error: error,
    });
  });
