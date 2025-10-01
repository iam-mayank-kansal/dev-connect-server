const logger = require("../helper/logger");
const { failureTemplate } = require("../helper/template");

// helper sendError
const sendError = async (res, msg, code = 400) => {
  const errorResponse = await failureTemplate(code, msg);

  logger.log({
    level: "info",
    message: JSON.stringify(errorResponse),
    timestamp: new Date().toISOString(),
  });

  return res.status(code).json(errorResponse);
};

module.exports = sendError;
