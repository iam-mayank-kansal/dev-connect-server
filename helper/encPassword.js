const bcrypt = require("bcrypt");
const logger = require("./logger");

async function encPassword(value, password, storedHash) {
  const genSalt = await bcrypt.genSalt(10);
  if (value === "generate") {
    const encryptPassword = await bcrypt.hash(password.trim(), genSalt);
    logger.log({
      level: "info",
      message: `Password encrypted successfully`,
      timestamp: new Date().toISOString(),
    });
    return encryptPassword;
  }
  if (value === "compare") {
    const comparePassword = await bcrypt.compare(password.trim(), storedHash);
    logger.log({
      level: "info",
      message: `Password comparison performed`,
      timestamp: new Date().toISOString(),
    });
    return comparePassword;
  }
}

module.exports = encPassword;
