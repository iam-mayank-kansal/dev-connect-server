const multer = require("multer");
const fs = require("fs");
const path = require("path");
const logger = require("./logger");

function uploadStore() {
  const storage = multer.diskStorage({
    destination: function (_, file, cb) {
      let uploadPath;

      // choose folder based on fieldname
      if (file.fieldname === "profilePicture") {
        uploadPath = path.join(__dirname, "..", "uploads", "profilePicture");
      } else if (file.fieldname === "resume") {
        uploadPath = path.join(__dirname, "..", "uploads", "resume");
      } else {
        uploadPath = path.join(__dirname, "..", "uploads", "others");
      }

      // ensure folder exists
      if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
      }

      logger.log({
        level: "info",
        message: `Uploading file to ${uploadPath}`,
        timestamp: new Date().toISOString(),
      });
      cb(null, uploadPath);
    },

    filename: function (req, file, cb) {
      const user = req.user;
      const ext = path.extname(file.originalname).toLowerCase();

      if (file.fieldname === "resume") {
        if (ext !== ".pdf") {
          return cb(new Error("Only PDF files are allowed"), false);
        }
        const resumeFileName = `DevConnect-user-resume.${user?._id}.pdf`;
        logger.log({
          level: "info",
          message: `Resume upload initiated for user ID: ${user?._id}`,
          timestamp: new Date().toISOString(),
        });
        return cb(null, resumeFileName);
      }

      if (file.fieldname === "profilePicture") {
        const imageFileName = `DevConnect-user-profilePicture.${user?._id}${ext}`;
        logger.log({
          level: "info",
          message: `Profile picture upload initiated for user ID: ${user?._id}`,
          timestamp: new Date().toISOString(),
        });
        return cb(null, imageFileName);
      }

      // fallback for other files
      const genericFileName = `${file.fieldname}.${Date.now()}.${user?._id()}${ext}`;
      logger.log({
        level: "info",
        message: `File upload initiated for user ID: ${user?._id}, field: ${file.fieldname}`,
        timestamp: new Date().toISOString(),
      });
      cb(null, genericFileName);
    },
  });

  return multer({ storage });
}

module.exports = uploadStore;
