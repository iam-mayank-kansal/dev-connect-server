import bcrypt from "bcrypt";
import logger from "./logger";

async function encPassword(
  value: string,
  password: string,
  storedHash?: string | undefined
) {
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
    if (!storedHash) {
      logger.log({
        level: "error",
        message: `Stored hash is undefined`,
        timestamp: new Date().toISOString(),
      });
      throw new Error("Stored hash is undefined");
    }
    const comparePassword = await bcrypt.compare(password.trim(), storedHash);
    logger.log({
      level: "info",
      message: `Password comparison performed`,
      timestamp: new Date().toISOString(),
    });
    return comparePassword;
  }
}

export default encPassword;
