const multer = require("multer");
const fs = require("fs");
const path = require("path");
const { v4: uuid } = require("uuid");

function uploadStore() {
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      let uploadPath;

      // choose folder based on fieldname
      if (file.fieldname === "profilePicture") {
        uploadPath = path.join(__dirname, "..", "uploads", "profilePic");
      } else if (file.fieldname === "resume") {
        uploadPath = path.join(__dirname, "..", "uploads", "resume");
      } else {
        uploadPath = path.join(__dirname, "..", "uploads", "others");
      }

      // ensure folder exists
      if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
      }

      cb(null, uploadPath);
    },

    filename: function (req, file, cb) {
      const ext = path.extname(file.originalname).toLowerCase();

      if (file.fieldname === "resume") {
        if (ext !== ".pdf") {
          return cb(new Error("Only PDF files are allowed"), false);
        }
        const resumeFileName = `DevConnect-user-resume.${
          new Date().toISOString().replace(/:/g, "-").split(".")[0]
        }.${uuid()}.pdf`;
        return cb(null, resumeFileName);
      }

      if (file.fieldname === "profilePicture") {
        const imageFileName = `DevConnect-user-profilePic.${
          new Date().toISOString().replace(/:/g, "-").split(".")[0]
        }.${uuid()}${ext}`;
        return cb(null, imageFileName);
      }

      // fallback for other files
      const genericFileName = `${file.fieldname}.${Date.now()}.${uuid()}${ext}`;
      cb(null, genericFileName);
    },
  });

  return multer({ storage });
}

module.exports = uploadStore;
