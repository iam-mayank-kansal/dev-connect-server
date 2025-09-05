const logger = require("./logger");

function calculateAge(dob) {
  // dob should be in "YYYY-MM-DD" format
  const birthDate = new Date(dob);
  const today = new Date();

  let age = today.getFullYear() - birthDate.getFullYear();

  // Adjust if birthday hasn't occurred yet this year
  const monthDiff = today.getMonth() - birthDate.getMonth();
  const dayDiff = today.getDate() - birthDate.getDate();

  if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
    age--;
  }

  logger.log({
    level: "info",
    message: `Calculated age for DOB ${dob}: ${age}`,
    timestamp: new Date().toISOString(),
  });

  return age;
}

module.exports = calculateAge;
