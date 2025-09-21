const { ObjectId } = require("mongodb");

function validateMongoId(...ids) {
  return ids.every((id) => ObjectId.isValid(id));
}

module.exports = validateMongoId;
