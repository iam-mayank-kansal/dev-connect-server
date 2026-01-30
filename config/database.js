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
      bufferCommands: false, // Fail fast so you can see the error
      maxPoolSize: 5,
      serverSelectionTimeoutMS: 30000, // 30s for initial connection attempt
      socketTimeoutMS: 45000, // 45s for socket operations
      heartbeatFrequencyMS: 10000,
    };

    cached.promise = mongoose
      .connect(process.env.MONGO_URI, opts)
      .then((mongoose) => {
        logger.log({ level: "info", message: "DB Connection Successful" });
        return mongoose;
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
