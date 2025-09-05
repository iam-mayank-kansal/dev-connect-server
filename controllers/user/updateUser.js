const userModel = require("../../models/user");
const {
  updateUserTemplate,
  failureTemplate,
} = require("../../helper/template");
const logger = require("../../helper/logger");
const calculateAge = require("../../helper/calculateAge");
const { v4: uuid } = require("uuid");
const { allowedSocialLinks } = require("../../utils/enum");

async function updateUser(req, res) {
  try {
    const user = req.user;
    const findUser = await userModel.findById(user._id);
    const updateData = await { ...req.updatedBody };

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

    // Skills array
    if (updateData.skills && Array.isArray(reqBodyData.skills)) {
      updateData.skills = updateData?.skills?.map((skill) => skill.trim());
    }

    // Education dates
    if (Array.isArray(updateData.education)) {
      updateData.education = updateData.education.map((edu) => ({
        ...edu,
        startDate: edu.startDate ? new Date(edu.startDate) : null,
        endDate: edu.endDate ? new Date(edu.endDate) : null,
      }));
    }

    // Experience dates
    if (Array.isArray(updateData.experience)) {
      updateData.experience = updateData.experience.map((exp) => ({
        ...exp,
        startDate: exp.startDate ? new Date(exp.startDate) : null,
        endDate: exp.endDate ? new Date(exp.endDate) : null,
      }));
    }

    // Certification dates
    if (Array.isArray(updateData.certification)) {
      updateData.certification = updateData.certification.map((cert) => ({
        ...cert,
        issueDate: cert.issueDate ? new Date(cert.issueDate) : null,
      }));
    }

    // Social Links
    if (updateData.socialLinks && Array.isArray(updateData.socialLinks)) {
      const filteredLinks = [];

      for (const link of updateData.socialLinks) {
        if (
          link.platform &&
          allowedSocialLinks.includes(link.platform.toLowerCase()) &&
          link.url
        ) {
          filteredLinks.push({
            platform: link.platform.trim(),
            url: link.url.trim(),
          });
        }
      }
      updateData.socialLinks = filteredLinks;
    }

    // Profile Picture
    if (updateData.file) {
      const profilePictureFileName = updateData?.file?.profilePicture?.[0]
        ? `${req.files.profilePicture[0].filename}`
        : null;
      updateData.profilePicture = profilePictureFileName;
    }

    // Resume
    if (updateData.file) {
      const resumeFileName = updateData?.file?.resume?.[0]
        ? `${req.files.resume[0].filename}`
        : null;
      updateData.resume = resumeFileName;
    }

    // Update User Document
    const updatedUser = await userModel.findByIdAndUpdate(
      user._id,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    );

    logger.log({
      level: "info",
      message: await updateUserTemplate(findUser.name, updatedUser),
      userAction: "user updated successfully",
    });

    return res
      .status(200)
      .json(await updateUserTemplate(findUser.name, updatedUser));
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
