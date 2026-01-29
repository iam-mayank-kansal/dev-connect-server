const jwt = require("jsonwebtoken");
const { failureTemplate } = require("../helper/template");
const logger = require("../helper/logger");

async function authRoute(req, res, next) {
  const requestId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  console.log("=== AUTH MIDDLEWARE START ===");
  console.log(`[Auth:${requestId}] Processing authentication for request`);
  console.log(`[Auth:${requestId}] Request details:`, {
    method: req.method,
    path: req.path,
    ip: req.ip,
    userAgent: req.get("user-agent")?.substring(0, 50),
    timestamp: new Date().toISOString(),
  });

  try {
    // Check for auth cookie
    console.log(`[Auth:${requestId}] Checking for auth cookie...`);
    let userCookie = await req.cookies["devconnect-auth-token"];

    console.log(`[Auth:${requestId}] Cookie check result:`, {
      hasCookie: !!userCookie,
      cookieLength: userCookie?.length || 0,
      allCookies: Object.keys(req.cookies),
    });

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
        console.log("[Auth] userCookie found in Authorization header");
      }
    } else {
      console.log("[Auth] userCookie found in cookie");
    }

    if (!userCookie) {
      console.warn(`[Auth:${requestId}] ✗ UNAUTHORIZED - No auth cookie found`);
      console.log(
        `[Auth:${requestId}] Available cookies:`,
        Object.keys(req.cookies)
      );

      logger.log({
        level: "warn",
        message: "Unauthorized access attempt - missing auth token",
        requestId,
        path: req.path,
        ip: req.ip,
        timestamp: new Date().toISOString(),
      });

      console.log("=== AUTH MIDDLEWARE END (UNAUTHORIZED) ===\n");
      return res.status(401).json(failureTemplate(401, "unauthorized route"));
    }

    // Verify JWT token
    console.log(`[Auth:${requestId}] Verifying JWT token...`);
    let decoded;

    try {
      decoded = jwt.verify(userCookie, process.env.JWT_SECRET_KEY);
      console.log(`[Auth:${requestId}] ✓ Token verified successfully`);
    } catch (jwtError) {
      console.error(`[Auth:${requestId}] ✗ JWT verification failed:`, {
        name: jwtError.name,
        message: jwtError.message,
        expiredAt: jwtError.expiredAt,
      });

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

    console.log(`[Auth:${requestId}] Decoded token payload:`, {
      userId: decoded?.payload?.id || decoded?.payload?._id,
      email: decoded?.payload?.email,
      hasPayload: !!decoded?.payload,
      iat: decoded?.iat ? new Date(decoded.iat * 1000).toISOString() : null,
      exp: decoded?.exp ? new Date(decoded.exp * 1000).toISOString() : null,
    });

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
    console.log(`[Auth:${requestId}] ✓ User attached to request object`);
    console.log(`[Auth:${requestId}] Authenticated user:`, {
      id: req.user?.id || req.user?._id,
      email: req.user?.email,
    });

    logger.log({
      level: "info",
      message: "Authentication successful - proceeding to next middleware",
      requestId,
      userId: req.user?.id || req.user?._id,
      path: req.path,
      timestamp: new Date().toISOString(),
    });

    console.log("=== AUTH MIDDLEWARE END (SUCCESS) ===\n");
    next();
  } catch (error) {
    console.error("=== AUTH MIDDLEWARE ERROR ===");
    console.error(`[Auth:${requestId}] ✗ Authentication error:`, {
      name: error.name,
      message: error.message,
      stack: error.stack,
    });

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

    console.log("=== AUTH MIDDLEWARE END (ERROR) ===\n");

    return res
      .status(401)
      .json(failureTemplate(401, "Unauthorized - Invalid or expired token"));
  }
}

module.exports = authRoute;
