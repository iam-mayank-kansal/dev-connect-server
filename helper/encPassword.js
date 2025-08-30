const bcrypt = require("bcrypt");

async function encPassword(value, password, storedHash) {
  const genSalt = await bcrypt.genSalt(10);
  if (value === "genrate") {
    const encryptPassword = await bcrypt.hash(password.trim(), genSalt);
    return encryptPassword;
  }
  if (value === "compare") {
    const comparePassword = await bcrypt.compare(password.trim(), storedHash);
    return comparePassword;
  }
}

module.exports = encPassword;
