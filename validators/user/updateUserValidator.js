const { failureTemplate } = require("../../helper/template");
const logger = require("../../helper/logger");
const userModel = require("../../models/user");
const { allowedFields } = require("../../utils/enum");
const { nameRegex, mobileRegex, urlRegex } = require("../../utils/regex");

async function updateUserValidation(req, res, next) {
  const user = req.user;
  const reqBodyData = req.body;

  // --- Start of the corrected data parsing code ---

  // Iterate through the body keys and attempt to parse any stringified JSON
  for (const key of Object.keys(reqBodyData)) {
    try {
      if (
        typeof reqBodyData[key] === "string" &&
        (reqBodyData[key].startsWith("{") || reqBodyData[key].startsWith("["))
      ) {
        reqBodyData[key] = JSON.parse(reqBodyData[key]);
      }
    } catch {
      // If parsing fails, it's not a valid JSON string, so we keep the original value.
    }
  }

  const fieldsToParse = [
    "socialLinks",
    "experience",
    "education",
    "certification",
  ];

  for (const field of fieldsToParse) {
    if (reqBodyData[field] !== undefined) {
      if (Array.isArray(reqBodyData[field])) {
        reqBodyData[field] = reqBodyData[field].map((item) => {
          try {
            return typeof item === "string" ? JSON.parse(item) : item;
          } catch {
            return item;
          }
        });
      } else if (
        typeof reqBodyData[field] === "object" &&
        !Array.isArray(reqBodyData[field])
      ) {
        reqBodyData[field] = [reqBodyData[field]];
      }
    }
  }

  // --- End of the corrected data parsing code ---

  // checking if the request body is empty
  if (!reqBodyData || Object.keys(reqBodyData).length === 0) {
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
  if (
    reqBodyData.mobile?.number !== undefined &&
    reqBodyData.mobile?.number != ""
  ) {
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
  if (
    reqBodyData.mobile?.countryCode !== undefined &&
    reqBodyData.mobile?.countryCode !== ""
  ) {
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
    if (typeof reqBodyData.bio !== "string" || reqBodyData.bio.length > 500) {
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
        country.trim().length > 20) &&
      country != ""
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
        state.trim().length > 20) &&
      state != ""
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
        city.trim().length > 20) &&
      city != ""
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
        address.trim().length > 80) &&
      address != ""
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

  // --- Upload Validation (Cloudinary/ImageKit URL Strings) ---
  if (reqBodyData.profilePicture !== undefined) {
    if (typeof reqBodyData.profilePicture !== "string") {
      logger.log({
        level: "error",
        message: await failureTemplate(
          400,
          "Profile picture must be a string URL."
        ),
      });
      return res
        .status(400)
        .json(
          await failureTemplate(400, "Profile picture must be a string URL.")
        );
    }
  }

  if (reqBodyData.resume !== undefined) {
    if (typeof reqBodyData.resume !== "string") {
      logger.log({
        level: "error",
        message: await failureTemplate(400, "Resume must be a string URL."),
      });
      return res
        .status(400)
        .json(await failureTemplate(400, "Resume must be a string URL."));
    }
  }

  logger.log({ level: "info", message: `Update User Validation Successful` });
  req.updatedBody = reqBodyData;

  next();
}

module.exports = updateUserValidation;
