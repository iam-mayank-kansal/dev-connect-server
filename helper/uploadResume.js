const multer = require("multer");
const fs = require("fs");
const path = require("path");
const { v4: uuid } = require("uuid");

// helper function to support resume uploads
function uploadedResumeStore() {
  const storeResume = multer.diskStorage({
    destination: function (req, file, cb) {
      const uploadPath = path.join(__dirname, "..", "uploads/resume");

      // ensure folder exists
      if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
      }

      cb(null, uploadPath);
    },

    filename: function (req, file, cb) {
      // only allow PDF
      const ext = path.extname(file.originalname).toLowerCase();
      if (ext !== ".pdf") {
        return cb(new Error("Only PDF files are allowed"), false);
      }

      const resumeFileName = `DevConnect-user-resume.${new Date()
        .toISOString()
        .replace(/:/g, "-")
        .split(".")[0]}.${uuid()}.pdf`;

      cb(null, resumeFileName);
    },
  });

  return multer({ storage: storeResume });
}

module.exports = uploadedResumeStore;
