import logger from "./logger";

function GlobalErrorHandlers() {
  // Global error handlers
  process.on("unhandledRejection", (reason) => {
    logger.log({
      level: "error",
      message: "Unhandled Promise Rejection",
      timestamp: new Date().toISOString(),
      error: reason,
    });
  });

  process.on("uncaughtException", (error) => {
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
}

export default GlobalErrorHandlers;
