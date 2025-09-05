const multer = require("multer");
const logger = require("./logger");

function handleMulter(middleware) {
  return (req, res, next) => {
    middleware(req, res, (err) => {
      if (!err) return next();

      const isMulterErr = err instanceof multer.MulterError;
      const status = isMulterErr ? 400 : 500;
      const message = isMulterErr ? err.message : "File upload error";

      logger.error({
        message: `${isMulterErr ? "Multer" : "Unknown"} error: ${err.message}`,
        timestamp: new Date().toISOString(),
      });

      return res.status(status).json({ error: message });
    });
  };
}

module.exports = handleMulter;
