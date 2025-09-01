const express = require("express");
const dotenv = require("dotenv");
const logger = require("./helper/logger");
const connectToDB = require("./config/database");
const cookieParser = require("cookie-parser");
const authRouter = require("./routes/authRouter");
const userRouter = require("./routes/userRouter");
const chalk = require("chalk");
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
      
      console.log(chalk.cyan.bold("===================================="));
      console.log(chalk.yellow.bold("🚀  DEV CONNECT SERVER STARTED  🚀"));
      console.log(chalk.green.bold("Project: Dev Connect"));
      console.log(chalk.magenta.bold("Contributors: Mayank Kansal & Kartik Bhatt"));
      console.log(chalk.blue("Server running at: http://localhost:3000"));
      console.log(chalk.cyan.bold("===================================="));
      
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

//routes

//auth routes
app.use("/devconnect/auth", authRouter);
//user routes
app.use("/devconnect/user", userRouter);
