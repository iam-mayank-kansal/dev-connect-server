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

  return age;
}

// Example
//   console.log(calculateAge("1999-08-31")); // 👉 26 (as of 2025)

module.exports = calculateAge;
