const { body, query, checkExact } = require("express-validator");
const ApiConstants = require("../config/constants");

const createNewTaskValidator = checkExact([
  body("title").isString().notEmpty().withMessage("Title cannot be empty"),
  body("description").isString().optional(),
  body("dueDate")
    .isISO8601()
    .withMessage("Due date must be a valid date in ISO format.")
    .optional()
    .toDate()
    .custom((value) => {
      if (value < new Date()) {
        throw new Error("Due date must be in the future.");
      }
      return true; // Indicates successful validation
    }),
  body("priority")
    .isIn(ApiConstants.priorities)
    .withMessage(`Priority can be only ${ApiConstants.priorities.join(", ")} `)
    .optional(),
]);

const updateTaskDetailsValidator = checkExact([
  body("title").isString().optional(),
  body("description").isString().optional(),
  body("dueDate")
    .isISO8601()
    .withMessage("Due date must be a valid date in ISO format.")
    .optional()
    .toDate()
    .custom((value) => {
      if (value < new Date()) {
        throw new Error("Due date must be in the future.");
      }
      return true; // Indicates successful validation
    }),
  body("priority")
    .isIn(ApiConstants.priorities)
    .withMessage(`Priority can be only ${ApiConstants.priorities.join(", ")} `)
    .optional(),
  body("status")
    .isIn(ApiConstants.status)
    .withMessage(`status can be only ${ApiConstants.status.join(", ")} `)
    .optional(),
  body("assignedTo").optional(),
]);

const validateTaskFilterQueries = checkExact([
  query("status")
    .isIn(ApiConstants.status)
    .withMessage(`status can be only ${ApiConstants.status.join(", ")} `)
    .optional(),
  query("search").isString().optional(),
  query("sortBy")
    .isIn(["asc", "desc"])
    .withMessage("sortBy can be either asc or desc")
    .optional(),
]);

module.exports = { createNewTaskValidator, updateTaskDetailsValidator, validateTaskFilterQueries };
