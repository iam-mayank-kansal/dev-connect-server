const userModel = require("../../models/user");
const { successTemplate, failureTemplate } = require("../../helper/template");
const logger = require("../../helper/logger");
const calculateAge = require("../../helper/calculateAge");
const { allowedSocialLinks } = require("../../utils/enum");
const jwt = require("jsonwebtoken");

async function updateUser(req, res) {
  try {
    const user = req.user;
    const findUser = await userModel.findById(user._id);

    // Merge req.body in case specific middleware didn't catch the new URL fields
    const updateData = { ...(req.updatedBody || req.body) };

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
    if (updateData.skills && Array.isArray(updateData.skills)) {
      updateData.skills = updateData.skills.map((skill) => skill.trim());
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

    // --- CHANGED: Handle Profile Picture (URL string from ImageKit) ---
    // We now expect a string URL in the body, not a file in req.files
    if (
      updateData.profilePicture &&
      typeof updateData.profilePicture === "string"
    ) {
      updateData.profilePicture = updateData.profilePicture.trim();
    }

    // Handle Profile Picture ID (for deletion later)
    if (
      updateData.profilePictureId &&
      typeof updateData.profilePictureId === "string"
    ) {
      updateData.profilePictureId = updateData.profilePictureId.trim();
    }

    // --- CHANGED: Handle Resume (URL string from ImageKit) ---
    // We now expect a string URL in the body, not a file in req.files
    if (updateData.resume && typeof updateData.resume === "string") {
      updateData.resume = updateData.resume.trim();
    }

    // Handle Resume ID (for deletion later)
    if (updateData.resumeId && typeof updateData.resumeId === "string") {
      updateData.resumeId = updateData.resumeId.trim();
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
      message: successTemplate(
        201,
        `${findUser.name} user updated successfully`,
        updatedUser
      ),
      userAction: "user updated successfully",
    });

    // Generate new token with updated user data
    const payload = updatedUser.toObject ? updatedUser.toObject() : updatedUser;
    const token = jwt.sign({ payload }, process.env.JWT_SECRET_KEY, {
      expiresIn: "5h",
    });

    const isProduction = process.env.NODE_ENV === "production";

    res.cookie("devconnect-auth-token", token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "None" : "Lax",
      maxAge: 5 * 60 * 60 * 1000, // 5 hours
    });

    return res
      .status(200)
      .json(
        successTemplate(
          201,
          `${findUser.name} user updated successfully`,
          updatedUser
        )
      );
  } catch (error) {
    logger.log({
      level: "error",
      message: `Error in updateUser controller: ${error.message}`,
    });
    return res.status(500).json(failureTemplate(500, "Internal Server Error"));
  }
}

module.exports = updateUser;
