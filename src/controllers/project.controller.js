const asyncHandler = require("express-async-handler");
const { NotFoundError } = require("../utils/custom-error");
const errorCodes = require("../utils/error-codes");
const { ProjectService } = require("../services/project.service");
const { AuthUserService } = require("../services/user.service");

const createNewProject = asyncHandler(async (req, res) => {
  const { projectName } = req.body;
  const { id } = req.user;
  const project = await ProjectService.createProject({
    projectName,
    projectLead: id,
    createdBy: id,
    members: [{ user: id }],
  });
  res.status(201).json(project);
});

const getAllProjectList = asyncHandler(async (req, res) => {
  const { id } = req.user;
  const projects = await ProjectService.getAllUserProjects(id);
  res.status(200).json(projects);
});

const getProjectDetails = asyncHandler(async (req, res) => {
  const project = req.project;
  res.status(200).json(project);
});

const invitePeopleToProject = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const { userId, role } = req.body;
  const user = await AuthUserService.findUserById(userId);
  if (!user) {
    throw new NotFoundError({
      code: errorCodes.USER_NOT_FOUND,
      message: "Invited user is not found in the database",
    });
  }
  await ProjectService.inviteUsersToProject({ projectId, userId, role });
  res.status(200).json({ message: "Invitation sent successfully" });
});

module.exports = {
  createNewProject,
  getAllProjectList,
  invitePeopleToProject,
  getProjectDetails,
};
