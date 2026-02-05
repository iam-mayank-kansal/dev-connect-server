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
  details: {
    nodeEnv: process.env.NODE_ENV,
    port: process.env.PORT,
    clientUrl: process.env.CLIENT_URL,
  },
});

// Configure CORS to allow credentials (cookies) from client
const corsOptions = {
  origin: process.env.CLIENT_URL || "http://localhost:3000",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

logger.log({
  level: "info",
  message: `CORS configured to allow requests from ${process.env.CLIENT_URL} with credentials`,
  timestamp: new Date().toISOString(),
});

// some middleware for data transfers
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//routes ------------------------->

// base route for health check
app.get("/", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "DevConnect Server is running!",
    timestamp: new Date().toISOString(),
  });
});

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

logger.log({
  level: "info",
  message: "All routes registered successfully",
  timestamp: new Date().toISOString(),
  routes: [
    "/devconnect/auth",
    "/devconnect/user",
    "/devconnect/otp",
    "/devconnect/userconnection",
    "/devconnect/blog",
    "/devconnect/message",
  ],
});

// listening to server if it's DB connection Successful
connectToDB()
  .then(() => {
    logger.log({
      level: "info",
      message: "Database connection established successfully",
      timestamp: new Date().toISOString(),
    });

    httpServer.listen(process.env.PORT, "0.0.0.0", () => {
      serverListenMessage();

      logger.log({
        level: "info",
        message: `Server Running Fine at ${process.env.ORIGIN_URL}`,
        timestamp: new Date().toISOString(),
        serverInfo: {
          port: process.env.PORT,
          originUrl: process.env.ORIGIN_URL,
          clientUrl: process.env.CLIENT_URL,
          nodeVersion: process.version,
        },
      });
    });
  })
  .catch((error) => {
    logger.log({
      level: "error",
      message: `DB Connection Failed`,
      timestamp: new Date().toISOString(),
      error: {
        name: error.name,
        message: error.message,
        code: error.code,
        stack: error.stack,
      },
    });

    // Exit process on DB connection failure
    process.exit(1);
  });

// Global error handlers
process.on("unhandledRejection", (reason) => {
  logger.log({
    level: "error",
    message: "Unhandled Promise Rejection",
    timestamp: new Date().toISOString(),
    error: reason,
  });
});

process.on("uncaughtException", (error) => {
  logger.log({
    level: "error",
    message: "Uncaught Exception",
    timestamp: new Date().toISOString(),
    error: {
      name: error.name,
      message: error.message,
      stack: error.stack,
    },
  });

  // Exit process on uncaught exception
  process.exit(1);
});
