const mongoose = require("mongoose");
const {COLLECTION_STATUS}=require("../utils/enum")


// creating user schema
const userConnectionSchema = new mongoose.Schema(
  {
    fromUserId:{
        type:String,
        required:true
    },
    toUserId:{
        type:String,
        required:true
    },
    status:{
        required:true,
        type:String,
        enum:COLLECTION_STATUS,
    },
  },
  { timestamps: true }
);

// creating user model
const userConnectionModel = mongoose.model("userConnections", userConnectionSchema);

module.exports = userConnectionModel;