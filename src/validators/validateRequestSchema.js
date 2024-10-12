const { validationResult } = require("express-validator");
const errorCodes = require("../utils/error-codes");
const { ValidationError } = require("../utils/custom-error");

function validateRequestSchema(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new ValidationError({
      message: errors.array()[0].msg,
      code: errorCodes.VALIDATION_ERROR,
    });
  }
  next();
}

const validateRequestFields = (allowedFields) => (req,res,next) => {
  const extraFields = Object.keys(req.body).filter(
    (field) => !allowedFields.includes(field)
  );
  if (extraFields.length > 0) {
    throw new ValidationError({
      message: `Unexpected field: ${extraFields[0]}`,
      code: errorCodes.VALIDATION_ERROR,
    });
  }
  next();
}

module.exports = { validateRequestSchema, validateRequestFields };
