const mongoose = require("mongoose");
const AutoIncrementFactory = require("mongoose-sequence");

//creating user schema
const userSchema = new mongoose.Schema(
  {
    userid: {
      type: Number,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      default: null,
    },
    mobile: {
      type: Number,
      required: true,
    },
    bio: {
      type: String,
      default: "",
    },
    dob: {
      type: String,
      default: "",
    },
    designation: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

const AutoIncrement = AutoIncrementFactory(mongoose);

// Attach the plugin — "userId" will increment automatically
userSchema.plugin(AutoIncrement, { inc_field: "userid" });

//creating user model
const userModel = mongoose.model("user", userSchema);

//exporting user model
module.exports = userModel;
