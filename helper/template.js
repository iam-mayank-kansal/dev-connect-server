const logger = require("./logger");

async function failureTemplate(scode, message) {
  const template = {
    responseCode: scode,
    status: "failure",
    message: message,
  };
  return template;
}

async function successTemplate(scode, message, data) {
  const template = {
    responseCode: scode,
    status: "success",
    message: message,
    data: data,
  };
  return template;
}

// OTP MODULE
async function otpSentTemplate(destination) {
  return {
    responseCode: "200",
    status: "success",
    message: `OTP sent successfully to ${destination}`,
  };
}

const sendError = async (res, msg, code = 400) => {
  logger.log({ level: "info", message: await failureTemplate(code, msg) });
  return res.status(code).json(await failureTemplate(code, msg));
};

module.exports = {
  failureTemplate,
  successTemplate,
  otpSentTemplate,
  sendError,
};
