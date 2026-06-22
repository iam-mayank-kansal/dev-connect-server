import { userModel } from "@/models/user.model";
import { successTemplate, failureTemplate } from "@/helper/template";
import logger from "@/helper/logger";
import calculateAge from "@/helper/calculateAge";
import { allowedSocialLinks } from "@/utils/enum";
import jwt from "jsonwebtoken";
import type { Request, Response } from "express";

async function updateUser(req: Request, res: Response) {
  try {
    const user = req.user!;
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
      if (!isNaN(dobDate.getTime())) {
        updateData.dob = dobDate;
        updateData.age = calculateAge(dobDate.toISOString().split("T")[0]!);
      }
    }

    // Skills array
    if (updateData.skills && Array.isArray(updateData.skills)) {
      updateData.skills = updateData.skills.map((skill: string) =>
        skill.trim()
      );
    }

    // Education dates
    if (Array.isArray(updateData.education)) {
      updateData.education = updateData.education.map((edu: any) => ({
        ...edu,
        startDate: edu.startDate ? new Date(edu.startDate) : null,
        endDate: edu.endDate ? new Date(edu.endDate) : null,
      }));
    }

    // Experience dates
    if (Array.isArray(updateData.experience)) {
      updateData.experience = updateData.experience.map((exp: any) => ({
        ...exp,
        startDate: exp.startDate ? new Date(exp.startDate) : null,
        endDate: exp.endDate ? new Date(exp.endDate) : null,
      }));
    }

    // Certification dates
    if (Array.isArray(updateData.certification)) {
      updateData.certification = updateData.certification.map((cert: any) => ({
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
      message: JSON.stringify(
        successTemplate(
          201,
          `${findUser!.name} user updated successfully`,
          updatedUser
        )
      ),
    });

    // Generate new token with updated user data
    const payload = updatedUser!.toObject();
    const token = jwt.sign({ payload }, process.env.JWT_SECRET_KEY!, {
      expiresIn: "5h",
    });

    const isProduction = process.env.NODE_ENV === "production";

    res.cookie("devconnect-auth-token", token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      maxAge: 5 * 60 * 60 * 1000, // 5 hours
    });

    return res
      .status(200)
      .json(
        successTemplate(
          201,
          `${findUser!.name} user updated successfully`,
          updatedUser
        )
      );
  } catch (error: any) {
    logger.log({
      level: "error",
      message: `Error in updateUser controller: ${error.message}`,
    });
    return res.status(500).json(failureTemplate(500, "Internal Server Error"));
  }
}

export default updateUser;
