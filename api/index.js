// configuring dotenv in main file to use it across all over the project
const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const cors = require("cors");

// imports
const cookieParser = require("cookie-parser");
const connectToDB = require("../config/database");
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
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Middleware
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cookieParser());

// Connect to database (async, non-blocking)
if (process.env.MONGO_URI) {
  connectToDB().catch((err) => {
    console.error("Database connection error:", err.message);
  });
}

// Health check endpoints
app.get("/", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "DevConnect Server is running!",
    timestamp: new Date().toISOString(),
  });
});

app.get("/devconnect", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "DevConnect Server is running!",
    timestamp: new Date().toISOString(),
  });
});

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// Routes
app.use("/devconnect/auth", authRouter);
app.use("/devconnect/user", userRouter);
app.use("/devconnect/otp", otpRouter);
app.use("/devconnect/connections", userConnectionRouter);
app.use("/devconnect/blogs", userBlogRouter);
app.use("/devconnect/messages", messageRouter);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    message: "Route not found",
    path: req.path,
  });
});

// Error handling middleware
app.use((err, req, res) => {
  console.error(err);

  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
    error: process.env.NODE_ENV === "production" ? {} : err,
  });
});

module.exports = app;
