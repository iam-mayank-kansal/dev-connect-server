// /utils/regex.js

/**
 * @description Regular expression for validating names (letters and spaces only).
 */
const nameRegex = /^[a-zA-Z\s]+$/;

/**
 * @description Regular expression for validating a 10-digit mobile number.
 */
const mobileRegex = /^\d{10}$/;

/**
 * @description Regular expression for validating URLs.
 * This fixes the `no-useless-escape` error.
 */
const urlRegex = /^(https?:\/\/)?([\w-])+\.([a-zA-Z]{2,63})([/\w-.]*)*\/?$/;

module.exports = {
  nameRegex,
  mobileRegex,
  urlRegex,
};
