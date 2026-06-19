// /utils/regex.js

import dotenvConfig from "@/config/dotenv.config";

const nameRegex = /^[a-zA-Z\s]+$/;

const mobileRegex = /^\d{10}$/;

const urlRegex = /^(https?:\/\/)?([\w-])+\.([a-zA-Z]{2,63})([/\w-.]*)*\/?$/;

const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;

const emailRegex = /^[A-Za-z0-9._%+-]{6,}@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

  const otpRegex = new RegExp(`^\\d{${dotenvConfig.OTP_LENGTH}}$`);

export { nameRegex, mobileRegex, urlRegex, passwordRegex, emailRegex, otpRegex };
