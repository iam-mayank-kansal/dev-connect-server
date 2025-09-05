const { failureTemplate } = require("../../helper/template");
const logger = require("../../helper/logger");
const userModel = require("../../models/user");
const { allowedFields } = require("../../utils/enum");

async function updateUserValidation(req, res, next) {
  const user = req.user;
  const reqBodyData = req.body;
  // const reqFileData = req.body;
  const reqFileData = req.files;

  // checking if the request body or files are empty
  if (
    (!reqBodyData || Object.keys(reqBodyData).length === 0) &&
    !reqFileData &&
    (!reqFileData || Object.keys(reqFileData).length === 0)
  ) {
    return res
      .status(400)
      .json(
        await failureTemplate(400, "Invalid request body: no data provided")
      );
  }

  const receivedFields = Object.keys(reqBodyData);
  const disallowedFields = receivedFields.filter(
    (field) => !allowedFields.includes(field)
  );

  // check if there are some disallowed fields in the request body
  if (disallowedFields.length > 0) {
    logger.log({
      level: "error",
      message: await failureTemplate(
        400,
        `Invalid fields in request body: ${disallowedFields.join(", ")}`
      ),
    });
    return res
      .status(400)
      .json(
        await failureTemplate(
          400,
          `Invalid fields in request body: ${disallowedFields.join(", ")}`
        )
      );
  }

  // Check if user exists in the database
  const findUser = await userModel.findById(user._id);
  if (!findUser) {
    logger.log({
      level: "error",
      message: await failureTemplate(
        400,
        "User does not exist! Kindly contact the administrator for registration"
      ),
    });
    return res
      .status(400)
      .json(
        await failureTemplate(
          400,
          "User does not exist! Kindly contact the administrator for registration"
        )
      );
  }

  // Name
  if (reqBodyData.name !== undefined) {
    const nameRegex = /^[a-zA-Z\s]+$/;
    if (
      reqBodyData.name.length < 3 ||
      reqBodyData.name.length > 50 ||
      !nameRegex.test(reqBodyData.name)
    ) {
      logger.log({
        level: "error",
        message: await failureTemplate(
          400,
          "Name must be 3-50 characters long and only contain letters and spaces."
        ),
      });
      return res
        .status(400)
        .json(
          await failureTemplate(
            400,
            "Name must be 3-50 characters long and only contain letters and spaces."
          )
        );
    }
  }

  // Age
  if (reqBodyData.age !== undefined) {
    if (typeof reqBodyData.age !== "number" || reqBodyData.age < 0) {
      logger.log({
        level: "error",
        message: await failureTemplate(400, "Age must be a positive number."),
      });
      return res
        .status(400)
        .json(await failureTemplate(400, "Age must be a positive number."));
    }
  }

  // Mobile Number
  if (reqBodyData.mobile?.number !== undefined) {
    const mobileRegex = /^\d{10}$/;
    if (!mobileRegex.test(reqBodyData.mobile.number)) {
      logger.log({
        level: "error",
        message: await failureTemplate(
          400,
          "Mobile number must be a 10-digit number."
        ),
      });
      return res
        .status(400)
        .json(
          await failureTemplate(400, "Mobile number must be a 10-digit number.")
        );
    }
  }

  // Mobile Country Code
  if (reqBodyData.mobile?.countryCode !== undefined) {
    if (
      typeof reqBodyData.mobile.countryCode !== "string" ||
      reqBodyData.mobile.countryCode.length > 5
    ) {
      logger.log({
        level: "error",
        message: await failureTemplate(
          400,
          "Mobile country code must be a string and not exceed 5 characters."
        ),
      });
      return res
        .status(400)
        .json(
          await failureTemplate(
            400,
            "Mobile country code must be a string and not exceed 5 characters."
          )
        );
    }
  }

  // Bio
  if (reqBodyData.bio !== undefined) {
    if (typeof reqBodyData.bio !== "string" || reqBodyData.bio.length > 200) {
      logger.log({
        level: "error",
        message: await failureTemplate(
          400,
          "Bio cannot exceed 200 characters."
        ),
      });
      return res
        .status(400)
        .json(await failureTemplate(400, "Bio cannot exceed 200 characters."));
    }
  }

  // DOB
  if (reqBodyData.dob !== undefined) {
    const date = new Date(reqBodyData.dob);
    if (isNaN(date.getTime())) {
      logger.log({
        level: "error",
        message: await failureTemplate(400, "DOB must be a valid date."),
      });
      return res
        .status(400)
        .json(await failureTemplate(400, "DOB must be a valid date."));
    }
  }

  // Designation
  if (reqBodyData.designation !== undefined) {
    if (
      typeof reqBodyData.designation !== "string" ||
      reqBodyData.designation.length < 2 ||
      reqBodyData.designation.length > 30
    ) {
      logger.log({
        level: "error",
        message: await failureTemplate(
          400,
          "Designation must be 2-30 characters long."
        ),
      });
      return res
        .status(400)
        .json(
          await failureTemplate(
            400,
            "Designation must be 2-30 characters long."
          )
        );
    }
  }

  // Location
  if (reqBodyData.location !== undefined) {
    if (
      typeof reqBodyData.location !== "object" ||
      Array.isArray(reqBodyData.location)
    ) {
      logger.log({
        level: "error",
        message: await failureTemplate(
          400,
          "Location must be an object with country, state, city, and address."
        ),
      });
      return res
        .status(400)
        .json(
          await failureTemplate(
            400,
            "Location must be an object with country, state, city, and address."
          )
        );
    }

    const { country, state, city, address } = reqBodyData.location;

    // check each field if they are provided ------------>
    if (
      country !== undefined &&
      (typeof country !== "string" ||
        country.trim().length < 2 ||
        country.trim().length > 20)
    ) {
      logger.log({
        level: "error",
        message: await failureTemplate(
          400,
          "Country must be a string between 2 and 20 characters."
        ),
      });
      return res
        .status(400)
        .json(
          await failureTemplate(
            400,
            "Country must be a string between 2 and 20 characters."
          )
        );
    }

    if (
      state !== undefined &&
      (typeof state !== "string" ||
        state.trim().length < 2 ||
        state.trim().length > 20)
    ) {
      logger.log({
        level: "error",
        message: await failureTemplate(
          400,
          "State must be a string between 2 and 20 characters."
        ),
      });
      return res
        .status(400)
        .json(
          await failureTemplate(
            400,
            "State must be a string between 2 and 20 characters."
          )
        );
    }

    if (
      city !== undefined &&
      (typeof city !== "string" ||
        city.trim().length < 2 ||
        city.trim().length > 20)
    ) {
      logger.log({
        level: "error",
        message: await failureTemplate(
          400,
          "City must be a string between 2 and 20 characters."
        ),
      });
      return res
        .status(400)
        .json(
          await failureTemplate(
            400,
            "City must be a string between 2 and 20 characters."
          )
        );
    }

    if (
      address !== undefined &&
      (typeof address !== "string" ||
        address.trim().length < 5 ||
        address.trim().length > 80)
    ) {
      logger.log({
        level: "error",
        message: await failureTemplate(
          400,
          "Address must be a string between 5 and 8 characters."
        ),
      });
      return res
        .status(400)
        .json(
          await failureTemplate(
            400,
            "Address must be a string between 5 and 8 characters."
          )
        );
    }
  }

  // Social Links
  if (reqBodyData.socialLinks !== undefined) {
    if (!Array.isArray(reqBodyData.socialLinks)) {
      logger.log({
        level: "error",
        message: await failureTemplate(400, "Social links must be an array."),
      });
      return res
        .status(400)
        .json(await failureTemplate(400, "Social links must be an array."));
    }
    const urlRegex =
      /^(https?:\/\/)?([\w\-])+\.{1}([a-zA-Z]{2,63})([\/\w\-.]*)*\/?$/;

    // mapping through each social link to validate
    for (const link of reqBodyData.socialLinks) {
      if (
        typeof link.platform !== "string" ||
        typeof link.url !== "string" ||
        !urlRegex.test(link.url)
      ) {
        logger.log({
          level: "error",
          message: await failureTemplate(
            400,
            "Each social link must have a valid 'platform' and 'url'."
          ),
        });
        return res
          .status(400)
          .json(
            await failureTemplate(
              400,
              "Each social link must have a valid 'platform' and 'url'."
            )
          );
      }
    }
  }

  // Skills
  if (reqBodyData.skills !== undefined) {
    if (
      !Array.isArray(reqBodyData.skills) ||
      !reqBodyData.skills.every((skill) => typeof skill === "string")
    ) {
      logger.log({
        level: "error",
        message: await failureTemplate(
          400,
          "Skills must be an array of strings."
        ),
      });
      return res
        .status(400)
        .json(
          await failureTemplate(400, "Skills must be an array of strings.")
        );
    }
  }

  // Education
  if (reqBodyData.education !== undefined) {
    if (!Array.isArray(reqBodyData.education)) {
      logger.log({
        level: "error",
        message: await failureTemplate(400, "Education must be an array."),
      });
      return res
        .status(400)
        .json(await failureTemplate(400, "Education must be an array."));
    }

    // mapping through each education entry to validate
    for (const edu of reqBodyData.education) {
      if (
        typeof edu.degree !== "string" ||
        typeof edu.institution !== "string"
      ) {
        logger.log({
          level: "error",
          message: await failureTemplate(
            400,
            "Each education entry must include 'degree' and 'institution' as strings."
          ),
        });
        return res
          .status(400)
          .json(
            await failureTemplate(
              400,
              "Each education entry must include 'degree' and 'institution' as strings."
            )
          );
      }
      if (edu.startDate && isNaN(new Date(edu.startDate).getTime())) {
        logger.log({
          level: "error",
          message: await failureTemplate(
            400,
            "Education startDate must be a valid date."
          ),
        });
        return res
          .status(400)
          .json(
            await failureTemplate(
              400,
              "Education startDate must be a valid date."
            )
          );
      }
      if (edu.endDate && isNaN(new Date(edu.endDate).getTime())) {
        logger.log({
          level: "error",
          message: await failureTemplate(
            400,
            "Education endDate must be a valid date."
          ),
        });
        return res
          .status(400)
          .json(
            await failureTemplate(
              400,
              "Education endDate must be a valid date."
            )
          );
      }
    }
  }

  // Experience
  if (reqBodyData.experience !== undefined) {
    if (!Array.isArray(reqBodyData.experience)) {
      logger.log({
        level: "error",
        message: await failureTemplate(400, "Experience must be an array."),
      });
      return res
        .status(400)
        .json(await failureTemplate(400, "Experience must be an array."));
    }

    // mapping through each experience entry to validate
    for (const exp of reqBodyData.experience) {
      if (typeof exp.position !== "string" || typeof exp.company !== "string") {
        logger.log({
          level: "error",
          message: await failureTemplate(
            400,
            "Each experience entry must include 'position' and 'company' as strings."
          ),
        });
        return res
          .status(400)
          .json(
            await failureTemplate(
              400,
              "Each experience entry must include 'position' and 'company' as strings."
            )
          );
      }
      if (exp.startDate && isNaN(new Date(exp.startDate).getTime())) {
        logger.log({
          level: "error",
          message: await failureTemplate(
            400,
            "Experience startDate must be a valid date."
          ),
        });
        return res
          .status(400)
          .json(
            await failureTemplate(
              400,
              "Experience startDate must be a valid date."
            )
          );
      }
      if (exp.endDate && isNaN(new Date(exp.endDate).getTime())) {
        logger.log({
          level: "error",
          message: await failureTemplate(
            400,
            "Experience endDate must be a valid date or null."
          ),
        });
        return res
          .status(400)
          .json(
            await failureTemplate(
              400,
              "Experience endDate must be a valid date or null."
            )
          );
      }
    }
  }

  // Certification
  if (reqBodyData.certification !== undefined) {
    if (!Array.isArray(reqBodyData.certification)) {
      logger.log({
        level: "error",
        message: await failureTemplate(400, "Certification must be an array."),
      });
      return res
        .status(400)
        .json(await failureTemplate(400, "Certification must be an array."));
    }

    // mapping through each certification entry to validate
    for (const cert of reqBodyData.certification) {
      if (
        typeof cert.certificate !== "string" ||
        typeof cert.issuedBy !== "string" ||
        typeof cert.company !== "string"
      ) {
        logger.log({
          level: "error",
          message: await failureTemplate(
            400,
            "Each certification entry must include 'company','certificate' and 'issuedBy' as strings."
          ),
        });
        return res
          .status(400)
          .json(
            await failureTemplate(
              400,
              "Each certification entry must include 'company','certificate' and 'issuedBy' as strings."
            )
          );
      }
      if (cert.issueDate && isNaN(new Date(cert.issueDate).getTime())) {
        logger.log({
          level: "error",
          message: await failureTemplate(
            400,
            "Certification issueDate must be a valid date."
          ),
        });
        return res
          .status(400)
          .json(
            await failureTemplate(
              400,
              "Certification issueDate must be a valid date."
            )
          );
      }
    }
  }

  // File Uploads
  if (reqFileData) {
    // const profilePicture = reqFileData.find(file => file.fieldname === "profilePicture");
    const profilePicture = reqFileData?.profilePicture?.[0];
    const resumePdf = reqFileData?.resume?.[0];

    if (profilePicture) {
      if (!profilePicture.mimetype.startsWith("image/")) {
        logger.log({
          level: "error",
          message: await failureTemplate(
            400,
            "Only image files are allowed for profile picture"
          ),
        });
        return res
          .status(400)
          .json(
            await failureTemplate(
              400,
              "Only image files are allowed for profile picture"
            )
          );
      }
      const MAX_IMAGE_SIZE = 2 * 1024 * 1024;
      if (profilePicture.size > MAX_IMAGE_SIZE) {
        logger.log({
          level: "error",
          message: await failureTemplate(
            400,
            `Profile picture cannot exceed ${MAX_IMAGE_SIZE / 1024 / 1024} MB`
          ),
        });
        return res
          .status(400)
          .json(
            await failureTemplate(
              400,
              `Profile picture cannot exceed ${MAX_IMAGE_SIZE / 1024 / 1024} MB`
            )
          );
      }
    }

    // resume pdf
    if (resumePdf) {
      if (resumePdf.mimetype !== "application/pdf") {
        logger.log({
          level: "error",
          message: await failureTemplate(
            400,
            "Only PDF files are allowed for Resume"
          ),
        });
        return res
          .status(400)
          .json(
            await failureTemplate(400, "Only PDF files are allowed for Resume")
          );
      }
      const MAX_PDF_SIZE = 5 * 1024 * 1024;
      if (resumePdf.size > MAX_PDF_SIZE) {
        logger.log({
          level: "error",
          message: await failureTemplate(
            400,
            `Resume cannot exceed ${MAX_PDF_SIZE / 1024 / 1024} MB`
          ),
        });
        return res
          .status(400)
          .json(
            await failureTemplate(
              400,
              `Resume cannot exceed ${MAX_PDF_SIZE / 1024 / 1024} MB`
            )
          );
      }
    }
  }

  logger.log({ level: "info", message: `Update User Validation Successful` });
  req.updatedBody = { ...reqBodyData, file: reqFileData };

  next();
}

module.exports = updateUserValidation;
