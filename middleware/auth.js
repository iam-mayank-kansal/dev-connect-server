const jwt = require("jsonwebtoken");
const { failureTemplate } = require("../helper/template");
const logger = require("../helper/logger");

async function authRoute(req, res, next) {
  try {
    const userCookie = await req.cookies['devconnect-auth-token'];
    logger.log({
      level: "info",
      message: "user cookie auth route.",
      userCookie,
    });

    if (!userCookie) {
      logger.log({
        level: "info",
        message: await failureTemplate(400, "unautorized route"),
      });

      return res
        .status(401)
        .json(await failureTemplate(400, "unautorized route"));
    }
    let decoded = jwt.verify(userCookie, process.env.JWT_SECRET_KEY);
    logger.log({
      level: "info",
      message: "decoded value from user cookie.",
      decoded,
    });

    // attaching user to req 
    req.user = decoded?.payload;
    next();
  }
   catch (error) {
    logger.log({
      level: "error",
      message: "decoded value from user cookie.",
      error,
    });
  }


}

module.exports = authRoute;
