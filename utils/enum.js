const OTP_TYPES = ["mobile", "email"];
const OTP_STATUS = ["pending", "verified"];
const allowedFields = [
  "_id",
  "name",
  "email",
  "mobile",
  "age",
  "bio",
  "dob",
  "designation",
  "profilePicture",
  "location",
  "socialLinks",
  "skills",
  "education",
  "experience",
  "resume",
  "certification",
];

const allowedSocialLinks = [
  "github",
  "linkedin",
  "twitter",
  "facebook",
  "instagram",
];

module.exports = {
  OTP_TYPES,
  OTP_STATUS,
  allowedFields,
  allowedSocialLinks,
};
