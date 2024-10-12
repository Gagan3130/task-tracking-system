const { body, query, checkExact } = require("express-validator");
const { validateRequestFields } = require("./validateRequestSchema");

const userRegistrationValidator = checkExact([
  body("name")
    .isString()
    .isLength({ min: 3 })
    .withMessage("Please provide valid name"),
  body("email")
    .notEmpty()
    .withMessage("Please provide email")
    .isEmail()
    .withMessage("Please provide valid email"),
  body("password")
    .isString()
    .isLength({ min: 8 })
    .withMessage("password must be at least 8 characters long"),
  body("jobTitle").isString().optional(),
  body("organisation").isString().optional(),
]);

const userLoginValidator = checkExact([
  body("email")
    .notEmpty()
    .withMessage("Please provide email")
    .isEmail()
    .withMessage("Please provide valid email"),
  body("password")
    .isString()
    .isLength({ min: 8 })
    .withMessage("password must be at least 8 characters long"),
]);

const userDetailsUpdateValidator = checkExact([
  body("jobTitle").isString().optional(),
  body("organisation").isString().optional(),
  body("name")
    .optional()
    .isString()
    .isLength({ min: 3 })
    .withMessage("Please provide valid name"),
//   validateRequestFields(["jobTitle", "organisation", "name"]),
]);

module.exports = {
  userRegistrationValidator,
  userLoginValidator,
  userDetailsUpdateValidator,
};
