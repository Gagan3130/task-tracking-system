const express = require("express");
const authMiddleware = require("../middleware/auth.middleware");
const {
  createNewProject,
  getAllProjectList,
  invitePeopleToProject,
  getProjectDetails,
} = require("../controllers/project.controller");
const {
  projectUserRoleMiddleware,
} = require("../middleware/project.middleware");
const {
  createProjectValidator,
  inviteProjectMemberValidator,
} = require("../validators/project.validator");
const {
  validateRequestSchema,
} = require("../validators/validateRequestSchema");

const router = express.Router();

router
  .route("/")
  .post(
    authMiddleware,
    createProjectValidator,
    validateRequestSchema,
    createNewProject
  )
  .get(authMiddleware, getAllProjectList);

router.route("/:projectId").get(authMiddleware, getProjectDetails);

router
  .route("/invite/:projectId")
  .post(
    authMiddleware,
    inviteProjectMemberValidator,
    validateRequestSchema,
    projectUserRoleMiddleware(["admin", "member"]),
    invitePeopleToProject
  );

module.exports = router;
