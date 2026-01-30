const winston = require("winston");
const fs = require("fs");
const path = require("path");

const logDir = "log";

// Only create log directory in development (Vercel is read-only)
if (process.env.NODE_ENV !== "production" && !fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

const transports = [];

// File logging only in development
if (process.env.NODE_ENV === "development") {
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

// Console logging in all environments
transports.push(
  new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.timestamp(),
      winston.format.printf(
        ({ level, message, timestamp }) => `${timestamp} [${level}] ${message}`
      )
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
