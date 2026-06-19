// configuring dotenv in main file to use it across all over the project
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";

// routes
import logger from "./helper/logger";
// import connectToDB from "./config/database";
import cookieParser from "cookie-parser";
import authRouter from "./routes/authRouter";
// import userRouter from "./routes/userRouter";
// import otpRouter from "./routes/otpRouter";
// import userConnectionRouter from "./routes/userConnectionRouter";
// import userBlogRouter from "./routes/userBlogRouter";
// import messageRouter from "./routes/messageRouter";

// other imports
import { app } from "./socket";
import GlobalErrorHandlers from "./helper/globalErrorHandlers";
import bootstrap from "./bootstrap";

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
app.get("/", (req: express.Request, res: express.Response) => {
  res.status(200).json({
    status: "success",
    message: "DevConnect Server is running!",
    timestamp: new Date().toISOString(),
  });
});

//auth routes
app.use("/devconnect/auth", authRouter);

// //user routes
// app.use("/devconnect/user", userRouter);

// // otp routes
// app.use("/devconnect/otp", otpRouter);

// // user connection routes
// app.use("/devconnect/userconnection", userConnectionRouter);

// // user blog routes
// app.use("/devconnect/blog", userBlogRouter);

// // chat routes
// app.use("/devconnect/message", messageRouter);

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

bootstrap();

GlobalErrorHandlers();
