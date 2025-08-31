const multer = require("multer");

function uploadProfilePic(fieldName) {
  const storage = multer.memoryStorage(); // store files in memory as buffer
  const upload = multer({ storage: storage });
  return upload.single(fieldName); // handle single file
}

module.exports = uploadProfilePic;
