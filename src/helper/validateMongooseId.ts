import { ObjectId } from "mongodb";

function validateMongoId(...ids: (string | ObjectId)[]): boolean {
  return ids.every((id) => ObjectId.isValid(id));
}

export default validateMongoId; 
