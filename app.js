// configuring dotenv in main file to use it across all over the project
const dotenv = require("dotenv");
dotenv.config();

console.log("=== SERVER INITIALIZATION START ===");
console.log("[Server] Loading environment variables...");
console.log("[Server] Environment:", process.env.NODE_ENV || "development");
console.log("[Server] Timestamp:", new Date().toISOString());

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

console.log("[Server] All modules imported successfully");

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
console.log("[Server] Configuring CORS...");
const corsOptions = {
  origin: process.env.CLIENT_URL || "http://localhost:3000",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

console.log("[Server] CORS Config:", corsOptions);

app.use(cors(corsOptions));

logger.log({
  level: "info",
  message: `CORS configured to allow requests from ${process.env.CLIENT_URL} with credentials`,
  timestamp: new Date().toISOString(),
});
console.log("[Server] ✓ CORS middleware configured");

// some middleware for data transfers
console.log("[Server] Configuring request parsing middleware...");
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

logger.log({
  level: "info",
  message: `Middleware for JSON and URL-encoded data configured`,
  timestamp: new Date().toISOString(),
});
console.log(
  "[Server] ✓ Cookie parser, JSON, and URL-encoded middleware configured"
);

//routes ------------------------->
console.log("[Server] Registering routes...");

// base route for health check
app.get("/", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "DevConnect Server is running!",
    timestamp: new Date().toISOString(),
  });
});
console.log("[Server] ✓ Base health check route registered at /devconnect");

//auth routes
app.use("/devconnect/auth", authRouter);
console.log("[Server] ✓ Auth routes registered at /devconnect/auth");

//user routes
app.use("/devconnect/user", userRouter);
console.log("[Server] ✓ User routes registered at /devconnect/user");

// otp routes
app.use("/devconnect/otp", otpRouter);
console.log("[Server] ✓ OTP routes registered at /devconnect/otp");

// user connection routes
app.use("/devconnect/userconnection", userConnectionRouter);
console.log(
  "[Server] ✓ User connection routes registered at /devconnect/userconnection"
);

// user blog routes
app.use("/devconnect/blog", userBlogRouter);
console.log("[Server] ✓ Blog routes registered at /devconnect/blog");

// chat routes
app.use("/devconnect/message", messageRouter);
console.log("[Server] ✓ Message routes registered at /devconnect/message");

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
console.log("[Server] Attempting database connection...");
console.log("=== DATABASE CONNECTION START ===");

connectToDB()
  .then(() => {
    console.log("[Database] ✓ Connection successful");
    logger.log({
      level: "info",
      message: "Database connection established successfully",
      timestamp: new Date().toISOString(),
    });

    console.log("[Server] Starting HTTP server...");
    console.log("[Server] Binding to:", {
      port: process.env.PORT,
      host: "0.0.0.0",
    });

    httpServer.listen(process.env.PORT, "0.0.0.0", () => {
      console.log("=== SERVER START SUCCESSFUL ===");
      console.log(
        `[Server] ✓ HTTP Server listening on port ${process.env.PORT}`
      );
      console.log(`[Server] ✓ Server URL: ${process.env.ORIGIN_URL}`);
      console.log(`[Server] ✓ Client URL: ${process.env.CLIENT_URL}`);
      console.log("=== SERVER READY ===\n");

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
    console.error("=== DATABASE CONNECTION FAILED ===");
    console.error("[Database] ✗ Connection error:", error.message);
    console.error("[Database] Error details:", {
      name: error.name,
      message: error.message,
      code: error.code,
      stack: error.stack,
    });

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

    console.error(
      "[Server] Server startup aborted due to database connection failure"
    );
    console.error("=== SERVER INITIALIZATION FAILED ===\n");

    // Exit process on DB connection failure
    process.exit(1);
  });

// Global error handlers
process.on("unhandledRejection", (reason, promise) => {
  console.error("=== UNHANDLED REJECTION ===");
  console.error("[Process] Unhandled Rejection at:", promise);
  console.error("[Process] Reason:", reason);

  logger.log({
    level: "error",
    message: "Unhandled Promise Rejection",
    timestamp: new Date().toISOString(),
    error: reason,
  });
});

process.on("uncaughtException", (error) => {
  console.error("=== UNCAUGHT EXCEPTION ===");
  console.error("[Process] Uncaught Exception:", error.message);
  console.error("[Process] Stack:", error.stack);

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

console.log("[Server] Global error handlers registered");
