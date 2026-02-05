const jwt = require("jsonwebtoken");
const { successTemplate } = require("../../helper/template");
const logger = require("../../helper/logger");

async function login(req, res) {
  const requestId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  try {
    const user = req.user;

    logger.log({
      level: "info",
      message: "Login attempt for user",
      requestId,
      userId: user?.id || user?._id,
      email: user?.email,
      timestamp: new Date().toISOString(),
    });

    // Creating jwt token on successful login
    const payload = user;
    const tokenExpiresIn = "5h";

    const token = jwt.sign({ payload }, process.env.JWT_SECRET_KEY, {
      expiresIn: tokenExpiresIn,
    });

    logger.log({
      level: "info",
      message: "JWT token generated",
      requestId,
      userId: user?.id || user?._id,
      expiresIn: tokenExpiresIn,
      timestamp: new Date().toISOString(),
    });

    // For production on Render: must have secure: true and sameSite: "None"
    const isProduction = process.env.NODE_ENV === "production";
    const cookieMaxAge = 5 * 60 * 60 * 1000; // 5 hours

    const cookieOptions = {
      httpOnly: true,
      secure: isProduction ? true : false,
      sameSite: isProduction ? "None" : "Lax",
      maxAge: cookieMaxAge,
      path: "/",
    };

    res.cookie("devconnect-auth-token", token, cookieOptions);

    logger.log({
      level: "info",
      message: "Cookie set with options",
      requestId,
      userId: user?.id || user?._id,
      cookieOptions: {
        httpOnly: true,
        secure: isProduction ? true : false,
        sameSite: isProduction ? "None" : "Lax",
        nodeEnv: process.env.NODE_ENV,
        maxAgeHours: 5,
      },
      timestamp: new Date().toISOString(),
    });

    const successMessage = `${user.name} user logged in successfully`;

    logger.log({
      level: "info",
      message: successMessage,
      requestId,
      userId: user?.id || user?._id,
      email: user?.email,
      name: user?.name,
      timestamp: new Date().toISOString(),
    });

    const response = successTemplate(201, successMessage, payload);

    res.status(201).json(response);
  } catch (error) {
    logger.log({
      level: "error",
      message: "Error during login process",
      requestId,
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack,
      },
      timestamp: new Date().toISOString(),
    });

    // Return error response
    res.status(500).json({
      success: false,
      message: "An error occurred during login",
      error:
        process.env.NODE_ENV === "production"
          ? "Internal server error"
          : error.message,
    });
  }
}

module.exports = login;
