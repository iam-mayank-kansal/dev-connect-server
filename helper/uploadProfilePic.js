const multer = require("multer");
const fs = require("fs");
const path = require("path");
const { v4: uuid } = require("uuid");

//helper function to suport image/file uploads
function uploadedImageStore() {
  const storeImage = multer.diskStorage({
    destination: function (req, file, cb) {
      const uploadPath = path.join(__dirname, "..", "uploads");
      console.log(uploadPath);
      // ensure folder exists
      if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
      }

      cb(null, uploadPath);
    },

    filename: function (req, file, cb) {
      //image store format
      const imageStringFormat = `DevConnect-profilePic.${new Date().toISOString().replace(/:/g, "-").split(".")[0]}.${uuid()}`;

      cb(null, `${imageStringFormat}.${file.originalname}`);
    },
  });

  return multer({ storage: storeImage });
}

module.exports = uploadedImageStore;
