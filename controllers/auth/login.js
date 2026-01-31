const jwt = require("jsonwebtoken");
const { successTemplate } = require("../../helper/template");
const logger = require("../../helper/logger");

async function login(req, res) {
  const requestId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  console.log("=== LOGIN CONTROLLER START ===");
  console.log(`[Login:${requestId}] Processing login request`);
  console.log(`[Login:${requestId}] Request details:`, {
    ip: req.ip,
    userAgent: req.get("user-agent")?.substring(0, 50),
    timestamp: new Date().toISOString(),
  });

  try {
    const user = req.user;

    console.log(`[Login:${requestId}] User data received:`, {
      userId: user?.id || user?._id,
      name: user?.name,
      email: user?.email,
      hasAllRequiredFields: !!(user?.id || user?._id) && !!user?.email,
    });

    logger.log({
      level: "info",
      message: "Login attempt for user",
      requestId,
      userId: user?.id || user?._id,
      email: user?.email,
      timestamp: new Date().toISOString(),
    });

    // Creating jwt token on successful login
    console.log(`[Login:${requestId}] Creating JWT token...`);
    const payload = user;
    const tokenExpiresIn = "5h";

    const token = jwt.sign({ payload }, process.env.JWT_SECRET_KEY, {
      expiresIn: tokenExpiresIn,
    });

    console.log(`[Login:${requestId}] ✓ JWT token created successfully`, {
      expiresIn: tokenExpiresIn,
      tokenLength: token.length,
      payloadSize: JSON.stringify(payload).length,
    });

    logger.log({
      level: "info",
      message: "JWT token generated",
      requestId,
      userId: user?.id || user?._id,
      expiresIn: tokenExpiresIn,
      timestamp: new Date().toISOString(),
    });

    // For cross-domain cookies to work: must have secure: true and sameSite: "None"
    const isProduction = process.env.NODE_ENV === "production";
    const cookieMaxAge = 5 * 60 * 60 * 1000; // 5 hours

    const cookieOptions = {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "None" : "Lax",
      maxAge: cookieMaxAge,
      path: "/",
    };

    console.log(`[Login:${requestId}] Setting auth cookie with options:`, {
      ...cookieOptions,
      maxAgeHours: cookieMaxAge / (60 * 60 * 1000),
      environment: process.env.NODE_ENV,
      isProduction,
    });

    res.cookie("devconnect-auth-token", token, cookieOptions);

    console.log(`[Login:${requestId}] ✓ Auth cookie set successfully`);

    logger.log({
      level: "info",
      message: "Cookie set with options",
      requestId,
      userId: user?.id || user?._id,
      cookieOptions: {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "None" : "Lax",
        nodeEnv: process.env.NODE_ENV,
        maxAgeHours: 5,
      },
      timestamp: new Date().toISOString(),
    });

    const successMessage = `${user.name} user logged in successfully`;

    console.log(
      `[Login:${requestId}] ✓ Login successful for user: ${user.name}`
    );
    console.log(`[Login:${requestId}] Preparing response...`);

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

    console.log(`[Login:${requestId}] Sending response:`, {
      status: 201,
      message: successMessage,
      hasPayload: !!payload,
    });

    console.log("=== LOGIN CONTROLLER END (SUCCESS) ===\n");

    res.status(201).json(response);
  } catch (error) {
    console.error("=== LOGIN CONTROLLER ERROR ===");
    console.error(`[Login:${requestId}] ✗ Login error:`, {
      name: error.name,
      message: error.message,
      stack: error.stack,
    });

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

    console.log("=== LOGIN CONTROLLER END (ERROR) ===\n");

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
