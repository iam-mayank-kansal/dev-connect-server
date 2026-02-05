const jwt = require("jsonwebtoken");
const { failureTemplate } = require("../helper/template");
const logger = require("../helper/logger");

async function authRoute(req, res, next) {
  const requestId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  try {
    // Check for auth cookie
    let userCookie = await req.cookies["devconnect-auth-token"];

    logger.log({
      level: "info",
      message: "Auth middleware - cookie check",
      requestId,
      hasCookie: !!userCookie,
      path: req.path,
      timestamp: new Date().toISOString(),
    });

    if (!userCookie) {
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith("Bearer ")) {
        userCookie = authHeader.substring(7);
      }
    }

    if (!userCookie) {
      logger.log({
        level: "warn",
        message: "Unauthorized access attempt - missing auth token",
        requestId,
        path: req.path,
        ip: req.ip,
        timestamp: new Date().toISOString(),
      });

      return res.status(401).json(failureTemplate(401, "unauthorized route"));
    }

    // Verify JWT token
    let decoded;

    try {
      decoded = jwt.verify(userCookie, process.env.JWT_SECRET_KEY);
    } catch (jwtError) {
      logger.log({
        level: "error",
        message: "JWT verification failed",
        requestId,
        error: {
          name: jwtError.name,
          message: jwtError.message,
          expiredAt: jwtError.expiredAt,
        },
        timestamp: new Date().toISOString(),
      });

      throw jwtError; // Re-throw to be caught by outer catch
    }

    logger.log({
      level: "info",
      message: "Token decoded successfully",
      requestId,
      userId: decoded?.payload?.id || decoded?.payload?._id,
      email: decoded?.payload?.email,
      timestamp: new Date().toISOString(),
    });

    // Attaching user to req
    req.user = decoded?.payload;

    logger.log({
      level: "info",
      message: "Authentication successful - proceeding to next middleware",
      requestId,
      userId: req.user?.id || req.user?._id,
      path: req.path,
      timestamp: new Date().toISOString(),
    });

    next();
  } catch (error) {
    logger.log({
      level: "error",
      message: "Error in auth middleware",
      requestId,
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack,
      },
      path: req.path,
      ip: req.ip,
      timestamp: new Date().toISOString(),
    });

    return res
      .status(401)
      .json(failureTemplate(401, "Unauthorized - Invalid or expired token"));
  }
}

module.exports = authRoute;
