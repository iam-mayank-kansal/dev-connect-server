const mongoose = require("mongoose");
const logger = require("../helper/logger");

console.log("Hello from database config");

async function connectToDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
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
