const imagekit = require("../../config/imageKit");

async function getImageKitAuth(req, res) {
  const user = req.user;

  if (user) {
    const authParams = imagekit.getAuthenticationParameters();
    res.json(authParams);
  }
}

module.exports = getImageKitAuth;
