// configuring dotenv in main file to use it across all over the project
const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const cors = require("cors");

// imports
const logger = require("../helper/logger");
const connectToDB = require("../config/database");
const cookieParser = require("cookie-parser");
const authRouter = require("../routes/authRouter");
const userRouter = require("../routes/userRouter");
const otpRouter = require("../routes/otpRouter");
const userConnectionRouter = require("../routes/userConnectionRouter");
const userBlogRouter = require("../routes/userBlogRouter");
const messageRouter = require("../routes/messageRouter");

const app = express();

// Enable CORS
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Middleware
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cookieParser());

// Connect to database
connectToDB();

// Health check endpoint
app.get("/", (req, res) => {
  res.status(200).json({
    message: "Dev Connect Server is running",
    timestamp: new Date().toISOString(),
  });
});

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// Routes
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/otp", otpRouter);
app.use("/api/connections", userConnectionRouter);
app.use("/api/blogs", userBlogRouter);
app.use("/api/messages", messageRouter);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    message: "Route not found",
    path: req.path,
  });
});

// Error handling middleware
app.use((err, _, res) => {
  logger.log({
    level: "error",
    message: err.message,
    stack: err.stack,
  });

  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
    error: process.env.NODE_ENV === "production" ? {} : err,
  });
});

module.exports = app;
