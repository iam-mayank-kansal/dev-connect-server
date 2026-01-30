const mongoose = require("mongoose");
const logger = require("../helper/logger");

async function connectToDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
      maxPoolSize: 5,
      minPoolSize: 1,
      retryWrites: true,
      w: "majority",
    });
    logger.log({
      level: "info",
      message: "DB Connection Successful",
    });
  } catch (error) {
    logger.log({
      level: "error",
      message: `DB Connection Failed`,
      error: error,
    });
    throw new Error(error);
  }
}

module.exports = connectToDB;
