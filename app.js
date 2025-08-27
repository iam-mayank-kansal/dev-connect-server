const express = require("express");
const dotenv = require("dotenv");
const logger = require("./helper/logger");
const connectToDB = require("./config/database");
const cookieParser = require("cookie-parser");
const app = express();

// some middleware for data transfers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// configuring dotenv in main file to use it across all over the project
dotenv.config();

// listening to server if it's DB connection Successful
connectToDB()
  .then(() => {
    app.listen(process.env.PORT, () => {
      logger.log({
        level: "info",
        message: `Server Running Fine at PORT : ${process.env.PORT}`,
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

// routes
app.use("/user", userRouter);
app.use("/auth", authRouter);
app.use("/user", userRouter);
