const express = require("express");
const authMiddleware = require("../middleware/auth.middleware");
const {
  createNewProject,
  getAllProjectList,
  invitePeopleToProject,
  getProjectDetails,
} = require("../controllers/project.controller");
const checkUserAssociatedWithProject = require("../middleware/project.middleware");

const router = express.Router();

router
  .route("/")
  .post(authMiddleware, createNewProject)
  .get(authMiddleware, getAllProjectList);

router.route("/:projectId").get(authMiddleware, getProjectDetails);

router
  .route("/invite/:projectId")
  .post(authMiddleware, checkUserAssociatedWithProject, invitePeopleToProject);

module.exports = router;
