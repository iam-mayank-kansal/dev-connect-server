const userModel = require("../../models/user");
const { updateUserTemplate, failureTemplate } = require("../../helper/template");
const logger = require("../../helper/logger");
const calculateAge = require("../../helper/calculateAge");
const { v4: uuid } = require("uuid");

async function updateUser(req, res) {
  try {
    const user = req.user;
    const findUser = await userModel.findById(user._id);
    const updateData = { ...req.updatedBody };

    if (updateData.name) {
      updateData.name = updateData.name.trim();
    }
    if (updateData.bio) {
      updateData.bio = updateData.bio.trim();
    }
    if (updateData.designation) {
      updateData.designation = updateData.designation.trim();
    }
    if (updateData.dob) {
      const dobDate = new Date(updateData.dob);
      if (!isNaN(dobDate)) {
        updateData.dob = dobDate;
        updateData.age = calculateAge(dobDate);
      }
    }

    /**
     * 🔹 Education dates
     */
    if (Array.isArray(updateData.education)) {
      updateData.education = updateData.education.map((edu) => ({
        ...edu,
        startDate: edu.startDate ? new Date(edu.startDate) : null,
        endDate: edu.endDate ? new Date(edu.endDate) : null,
      }));
    }

    /**
     * 🔹 Experience dates
     */
    if (Array.isArray(updateData.experience)) {
      updateData.experience = updateData.experience.map((exp) => ({
        ...exp,
        startDate: exp.startDate ? new Date(exp.startDate) : null,
        endDate: exp.endDate ? new Date(exp.endDate) : null,
      }));
    }

    /**
     * 🔹 Certification dates
     */
    if (Array.isArray(updateData.certification)) {
      updateData.certification = updateData.certification.map((cert) => ({
        ...cert,
        issueDate: cert.issueDate ? new Date(cert.issueDate) : null,
      }));
    }

    /**
     * 🔹 Profile Picture
     */
    if (req.file) {
      const imageStringFormat = `DevConnect-userprofilePic.${new Date()
        .toISOString()
        .replace(/:/g, "-")
        .split(".")[0]}.${uuid()}`;
      updateData.profilePicture = `${user.email}.${imageStringFormat}`;
    }

    /**
     * 🔹 Update user
     */
    const updatedUser = await userModel.findByIdAndUpdate(user._id, updateData, {
      new: true,
      runValidators: true,
    });

    logger.log({
      level: "info",
      message: await updateUserTemplate(findUser.name, updatedUser),
      userAction: "user updated successfully",
    });

    return res.status(200).json(await updateUserTemplate(findUser.name, updatedUser));
  } catch (error) {
    logger.log({
      level: "error",
      message: `Error in updateUser controller: ${error.message}`,
    });
    return res
      .status(500)
      .json(await failureTemplate(500, "Internal Server Error"));
  }
}

module.exports = updateUser;
