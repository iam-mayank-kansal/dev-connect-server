// setting up winston library which will be used for logging
const winston = require("winston");

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.prettyPrint()
  ),
  // to create logging file
  transports: [
    // for only error
    new winston.transports.File({
      filename: "./log/error.log",
      level: "error",
    }),

    // for combined error, warning, req, res and others
    new winston.transports.File({ filename: "./log/combined.log" }),
  ],
});

//  If we're not in production then log to the `console` with the format:
//  `${info.level}: ${info.message} JSON.stringify({ ...rest }) `

if (process.env.NODE_ENV == "development") {
  logger.add(
    new winston.transports.Console({
      format: winston.format.simple(),
    })
  );
}

module.exports = logger;
