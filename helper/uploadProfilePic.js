const multer = require("multer");
const fs = require("fs");
const path = require("path");
const { v4: uuid } = require("uuid");

//helper function to suport image/file uploads
function uploadedImageStore() {
  //disk storage

  const storeImage = multer.diskStorage({
    destination: function (req, file, cb) {
      const uploadPath = path.join(__dirname, "..", "uploads/profilePic");

      // ensure folder exists
      if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
      }

      cb(null, uploadPath);
    },

    filename: function (req, file, cb) {
      //image store format
      const imageStringFormat = `DevConnect-userprofilePic.${new Date().toISOString().replace(/:/g, "-").split(".")[0]}.${uuid()}`;

      cb(null, `${imageStringFormat}.${file.originalname}`);
    },
  });

  return multer({ storage: storeImage });

  // // memory storage for processing in memory
  // return multer({ storage: multer.memoryStorage() });
}

module.exports = uploadedImageStore;
