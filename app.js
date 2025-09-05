const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

// imports
const logger = require("./helper/logger");
const connectToDB = require("./config/database");
const cookieParser = require("cookie-parser");
const authRouter = require("./routes/authRouter");
const userRouter = require("./routes/userRouter");
const otpRouter = require("./routes/otpRouter");
const serverListenMessage = require("./helper/serverListenMessage");

const app = express();

// configuring dotenv in main file to use it across all over the project
dotenv.config();
logger.log({
  level: "info",
  message: `Environment variables loaded from .env file`,
  timestamp: new Date().toISOString(),
});

// Allow all origins (dev mode)
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);
logger.log({
  level: "info",
  message: `CORS configured to allow requests from ${process.env.CLIENT_URL}`,
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

// statically hosting uploads folder
app.use("/uploads", express.static("uploads"));

// listening to server if it's DB connection Successful
connectToDB()
  .then(() => {
    app.listen(process.env.PORT, () => {
      serverListenMessage();
      logger.log({
        level: "info",
        message: `Server Running Fine at ${process.env.ORIGIN_URL}`,
      });
    });
  })
  .catch((error) => {
    logger.log({
      level: "error",
      message: `DB Connection Failed`,
      error: error,
    });
  });

//routes ------------------------->
//auth routes
app.use("/devconnect/auth", authRouter);
//user routes
app.use("/devconnect/user", userRouter);
// otp routes
app.use("/devconnect/otp", otpRouter);
