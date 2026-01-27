// const userModel = require("../../models/user");
// const { successTemplate } = require("../../helper/template");
// const logger = require("../../helper/logger");

// async function displayUser(req, res) {
//   const user = req.user;
//   const userBodyData = req.body; // unused variable

//   const findUser = await userModel
//     .findById(userBodyData?._id ? userBodyData?._id : user._id)
//     .select("-password -updatedAt -resetToken -resetTokenExpiry -__v -role");
//   logger.log({
//     level: "info",
//     action: "user displayed successfully",
//     message: await successTemplate(
//       201,
//       "user displayed successfully",
//       findUser
//     ),
//   });
//   res
//     .status(201)
//     .json(await successTemplate(201, "user displayed successfully", findUser));
// }

// module.exports = displayUser;
