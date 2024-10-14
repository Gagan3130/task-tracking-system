const express = require("express");
const authMiddleware = require("../middleware/auth.middleware");
const {
  createNewTask,
  getAllMyTasks,
  updateTaskDetails,
  getTaskDetails,
  fetchAllTask,
} = require("../controllers/task.controller");
const {
  createNewTaskValidator,
  updateTaskDetailsValidator,
  validateTaskFilterQueries,
} = require("../validators/task.validator");
const {
  validateRequestSchema,
} = require("../validators/validateRequestSchema");
const {
  projectUserRoleMiddleware,
} = require("../middleware/project.middleware");

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .post(
    authMiddleware,
    createNewTaskValidator,
    validateRequestSchema,
    projectUserRoleMiddleware(["admin", "member"]),
    createNewTask
  )
  .get(
    authMiddleware,
    validateTaskFilterQueries,
    validateRequestSchema,
    projectUserRoleMiddleware(["admin", "member", "viewer"]),
    fetchAllTask
  );

router
  .route("/assigned-to-me")
  .get(
    authMiddleware,
    projectUserRoleMiddleware(["admin", "member", "viewer"]),
    getAllMyTasks
  );
router
  .route("/:taskId")
  .put(
    authMiddleware,
    updateTaskDetailsValidator,
    validateRequestSchema,
    projectUserRoleMiddleware(["admin", "member"]),
    updateTaskDetails
  )
  .get(
    authMiddleware,
    projectUserRoleMiddleware(["admin", "member", "viewer"]),
    getTaskDetails
  );

module.exports = router;
