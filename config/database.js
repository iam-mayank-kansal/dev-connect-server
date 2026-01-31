const mongoose = require("mongoose");
const logger = require("../helper/logger");

// Caching the connection across serverless invocations
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectToDB() {
  if (cached.conn) {
    return cached.conn; // Reuse existing connection
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      maxPoolSize: 5,
      minPoolSize: 1,
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
      heartbeatFrequencyMS: 10000,
      retryWrites: true,
      w: "majority",
      family: 4, // Use IPv4
    };

    cached.promise = mongoose
      .connect(process.env.MONGO_URI, opts)
      .then((mongoose) => {
        console.log("[DB] Connection successful!");
        logger.log({ level: "info", message: "DB Connection Successful" });
        return mongoose;
      })
      .catch((err) => {
        console.error("[DB] Connection failed:", err.message);
        logger.log({
          level: "error",
          message: "DB Connection Failed",
          error: err.message,
        });
        throw err;
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    cached.promise = null; // Reset promise on failure
    logger.log({
      level: "error",
      message: "DB Connection Failed",
      error: error.message,
    });
    throw error;
  }

  return cached.conn;
}

module.exports = connectToDB;
