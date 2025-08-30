const jwt = require("jsonwebtoken");
const { failureTemplate } = require("../helper/template");
const logger = require("../helper/logger");

async function authRoute(req, res, next) {
  try {
    const userCookie = await req.cookies.devConnect;
    logger.log({
      level: "info",
      message: "user cookie auth route>>>.",
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
    const decodeValue = jwt.verify(userCookie, process.env.SECRETKEY);
    logger.log({
      level: "info",
      message: "decoded value from user cookie>>>.",
      decodeValue,
    });
  } catch (error) {
    logger.log({
      level: "error",
      message: "decoded value from user cookie>>>.",
      error,
    });
  }
  next();
}

module.exports = authRoute;
