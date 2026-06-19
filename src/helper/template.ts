import logger from "./logger";

function failureTemplate(scode: any, message: string) {
  const template = {
    responseCode: scode,
    status: "failure",
    message: message,
  };
  return template;
}

function successTemplate(scode: any, message: string, data?: any) {
  const template = {
    responseCode: scode,
    status: "success",
    message: message,
    data: data,
  };
  return template;
}

function otpSentTemplate(destination: string) {
  return {
    responseCode: 200,
    status: "success",
    message: `OTP sent successfully to ${destination}`,
  };
}

const sendError = (res: any, msg: string, code = 400) => {
  const errorResponse = failureTemplate(code, msg);

  logger.log({
    level: "info",
    message: JSON.stringify(errorResponse),
    timestamp: new Date().toISOString(),
  });

  return res.status(code).json(errorResponse);
};

export { failureTemplate, successTemplate, otpSentTemplate, sendError };
