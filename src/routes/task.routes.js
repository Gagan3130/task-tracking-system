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
const checkUserAssociatedWithProject = require("../middleware/project.middleware");

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .post(
    authMiddleware,
    createNewTaskValidator,
    validateRequestSchema,
    checkUserAssociatedWithProject,
    createNewTask
  )
  .get(
    authMiddleware,
    validateTaskFilterQueries,
    validateRequestSchema,
    checkUserAssociatedWithProject,
    fetchAllTask
  );

router
  .route("/assigned-to-me")
  .get(authMiddleware, checkUserAssociatedWithProject, getAllMyTasks);
router
  .route("/:taskId")
  .put(
    authMiddleware,
    updateTaskDetailsValidator,
    validateRequestSchema,
    checkUserAssociatedWithProject,
    updateTaskDetails
  )
  .get(authMiddleware, checkUserAssociatedWithProject, getTaskDetails);

module.exports = router;
