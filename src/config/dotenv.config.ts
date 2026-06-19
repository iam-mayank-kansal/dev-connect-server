import dotenv from "dotenv";
dotenv.config();

interface DotenvConfig {
  CLIENT_URL: string;
  EMAIL_SERVICE: string;
  GMAIL_PASS: string;
  GMAIL_USER: string;
  IMAGEKIT_PRIVATE_KEY: string;
  IMAGEKIT_PUBLIC_KEY: string;
  IMAGEKIT_URL_ENDPOINT: string;
  JWT_SECRET_KEY: string;
  LOG_LEVEL: string;
  MONGODB_URI: string;
  NODE_ENV: string;
  ORIGIN_URL: string;
  OTP_LENGTH: string;
  PORT: string;
}

const dotenvConfig: DotenvConfig = {
  CLIENT_URL: process.env.CLIENT_URL || "http://localhost:3000",
  EMAIL_SERVICE: process.env.EMAIL_SERVICE || "gmail",
  GMAIL_PASS: process.env.GMAIL_PASS || "",
  GMAIL_USER: process.env.GMAIL_USER || "",
  IMAGEKIT_PRIVATE_KEY: process.env.IMAGEKIT_PRIVATE_KEY || "",
  IMAGEKIT_PUBLIC_KEY: process.env.IMAGEKIT_PUBLIC_KEY || "",
  IMAGEKIT_URL_ENDPOINT: process.env.IMAGEKIT_URL_ENDPOINT || "",
  JWT_SECRET_KEY: process.env.JWT_SECRET_KEY || "your_jwt_secret_key",
  LOG_LEVEL: process.env.LOG_LEVEL || "info",
  MONGODB_URI:
    process.env.MONGODB_URI || "mongodb://localhost:27017/devconnect",
  NODE_ENV: process.env.NODE_ENV || "development",
  ORIGIN_URL: process.env.ORIGIN_URL || "http://localhost:8000",
  OTP_LENGTH: process.env.OTP_LENGTH || "6",
  PORT: process.env.PORT || "5000",
};

export default dotenvConfig;
