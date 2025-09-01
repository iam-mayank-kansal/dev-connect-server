const { failureTemplate } = require("../../helper/template");
const logger = require("../../helper/logger");
const userModel = require("../../models/user");

async function updateUserValidation(req, res, next) {
  const user = req.user;
  const { password, name, mobile, bio, dob, designation } = req.body;
  if (!req.body) {
    logger.log({
      level: "info",
      message: await failureTemplate(400, "invalid request body"),
    });
    return res
      .status(400)
      .json(await failureTemplate(400, "invalid request body"));
  }
  const findUser = await userModel.findById(user._id);

  if (findUser == null) {
    logger.log({
      level: "info",
      message: await failureTemplate(
        400,
        "User does not exists! kindly contact adminitrator for registration"
      ),
    });

    return res
      .status(400)
      .json(
        await failureTemplate(
          400,
          "User does not exists! kindly contact adminitrator for registration"
        )
      );
  }

  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
  if (!passwordRegex.test(password)) {
    logger.log({
      level: "info",
      message: await failureTemplate(
        400,
        "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&)."
      ),
    });
    return res
      .status(400)
      .json(
        await failureTemplate(
          400,
          "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&)."
        )
      );
  }

  if (name.length < 3 || name.length > 20) {
    logger.log({
      level: "info",
      message: await failureTemplate(400, "Enter Valid Name"),
    });
    return res.status(400).json(await failureTemplate(400, "Enter Valid Name"));
  }
  const mobileRegex = /^[6-9]\d{9}$/;
  if (!mobileRegex.test(mobile)) {
    logger.log({
      level: "info",
      message: await failureTemplate(
        400,
        "Mobile number must be 10 digits long, start with 6, 7, 8, or 9, and can optionally include the country code +91."
      ),
    });
    return res
      .status(400)
      .json(
        await failureTemplate(
          400,
          "Mobile number must be 10 digits long, start with 6, 7, 8, or 9, and can optionally include the country code +91."
        )
      );
  }
  // Name Validation
  const nameRegex = /^[a-zA-Z\s]+$/;
  if (!name || name.length < 3 || name.length > 50 || !nameRegex.test(name)) {
    logger.log({
      level: "info",
      message: await failureTemplate(
        400,
        "Name must be 3–50 characters long and only contain letters and spaces."
      ),
    });
    return res
      .status(400)
      .json(
        await failureTemplate(
          400,
          "Name must be 3–50 characters long and only contain letters and spaces."
        )
      );
  }

  // DOB Validation
  // Expecting YYYY-MM-DD format
  const dobRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dob || !dobRegex.test(dob)) {
    logger.log({
      level: "info",
      message: await failureTemplate(
        400,
        "DOB must be a valid date in YYYY-MM-DD format."
      ),
    });
    return res
      .status(400)
      .json(
        await failureTemplate(
          400,
          "DOB must be a valid date in YYYY-MM-DD format."
        )
      );
  }

  // Bio Validation
  if (bio && bio.length > 200) {
    logger.log({
      level: "info",
      message: await failureTemplate(400, "Bio cannot exceed 200 characters."),
    });
    return res
      .status(400)
      .json(await failureTemplate(400, "Bio cannot exceed 200 characters."));
  }

  // Designation Validation
  if (!designation || designation.length < 2 || designation.length > 100) {
    logger.log({
      level: "info",
      message: await failureTemplate(
        400,
        "Designation is required and must be 2–100 characters long."
      ),
    });
    return res
      .status(400)
      .json(
        await failureTemplate(
          400,
          "Designation is required and must be 2–100 characters long."
        )
      );
  }
  if (req.file) {
    // Validate file type
    if (!req.file.mimetype.startsWith("image/")) {
      logger.log({
        level: "info",
        message: await failureTemplate(400, "Only image files are allowed"),
      });
      return res
        .status(400)
        .json(await failureTemplate(400, "Only image files are allowed"));
    }

    // Validate file size (max 2MB)
    const MAX_SIZE = 2 * 1024 * 1024; // 2MB
    if (req.file.size > MAX_SIZE) {
      logger.log({
        level: "info",
        message: await failureTemplate(
          400,
          `Profile picture cannot exceed ${MAX_SIZE / 1024 / 1024} MB`
        ),
      });
      return res
        .status(400)
        .json(
          await failureTemplate(
            400,
            `Profile picture cannot exceed ${MAX_SIZE / 1024 / 1024} MB`
          )
        );
    }
  }
  next();
}

module.exports = updateUserValidation;
