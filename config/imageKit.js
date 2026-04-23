const ImageKit = require("@imagekit/nodejs");

function getImageKitConfig() {
  return {
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
  };
}

function hasImageKitEnv() {
  const { publicKey, privateKey, urlEndpoint } = getImageKitConfig();

  return Boolean(publicKey && privateKey && urlEndpoint);
}

function createImageKitClient() {
  if (!hasImageKitEnv()) {
    return null;
  }

  return new ImageKit(getImageKitConfig());
}

const client = createImageKitClient();

async function deleteFile(fileId) {
  if (!client?.files?.delete) {
    throw new Error("ImageKit delete API is unavailable");
  }

  return client.files.delete(fileId);
}

function getAuthenticationParameters(options = {}) {
  if (!client?.helper?.getAuthenticationParameters) {
    throw new Error("ImageKit auth helper is unavailable");
  }

  const { token, expire } = options;

  if (token || expire) {
    return client.helper.getAuthenticationParameters(token, expire);
  }

  return client.helper.getAuthenticationParameters();
}

module.exports = {
  client,
  hasImageKitEnv,
  getAuthenticationParameters,
  deleteFile,
};
