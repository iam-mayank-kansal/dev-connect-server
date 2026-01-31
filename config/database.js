const mongoose = require("mongoose");
const logger = require("../helper/logger");

// Caching connection for serverless
let cached = global.mongoose;
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectToDB() {
  if (cached.conn) {
    console.log("[DB] Using cached connection");
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      maxPoolSize: 5,
      minPoolSize: 0,
      serverSelectionTimeoutMS: 15000,
      socketTimeoutMS: 25000,
      maxIdleTimeMS: 30000,
    };

    console.log("[DB] Creating new connection...");
    cached.promise = mongoose
      .connect(process.env.MONGO_URI, opts)
      .then((mongoose) => {
        console.log("[DB] ✓ Connection successful!");
        logger.log({
          level: "info",
          message: "DB Connection Successful",
        });
        return mongoose;
      })
      .catch((error) => {
        console.error("[DB] ✗ Connection failed:", error.message);
        logger.log({
          level: "error",
          message: "DB Connection Failed",
          error: error.message,
        });
        throw new Error(error);
      });
  }

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (error) {
    console.error("[DB] ✗ Promise failed:", error.message);
    throw error;
  }
}

module.exports = connectToDB;
