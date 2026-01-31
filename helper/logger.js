const winston = require("winston");
const fs = require("fs");
const path = require("path");

const logDir = "log";

// Only in development - create logs
if (process.env.NODE_ENV !== "production") {
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
  }
}

const transports = [];

// File logging ONLY in development
if (process.env.NODE_ENV !== "production") {
  transports.push(
    new winston.transports.File({
      filename: path.join(logDir, "error.log"),
      level: "error",
    }),
    new winston.transports.File({
      filename: path.join(logDir, "combined.log"),
    })
  );
}

// Console logging in ALL environments with colors
transports.push(
  new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    ),
  })
);

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.prettyPrint()
  ),
  transports,
});

module.exports = logger;
