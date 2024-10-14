const { body, query, checkExact } = require("express-validator");

const createProjectValidator = checkExact([
  body("projectName")
    .isString()
    .notEmpty()
    .withMessage("Project name is required"),
]);

const inviteProjectMemberValidator = checkExact([
  body("role")
    .isString()
    .isIn(["admin", "member", "viewer"])
    .withMessage("role can be either admin , member or viewer"),
]);

module.exports = { createProjectValidator, inviteProjectMemberValidator };
