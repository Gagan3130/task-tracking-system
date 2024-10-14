const asyncHandler = require("express-async-handler");
const Project = require("../models/project.model");
const { NotFoundError, UnAuthorisedError } = require("../utils/custom-error");
const errorCodes = require("../utils/error-codes");
const User = require("../models/user.model");

const createNewProject = asyncHandler(async (req, res) => {
  const { projectName } = req.body;
  const { id } = req.user;
  const project = await Project.create({
    projectName,
    projectLead: id,
    createdBy: id,
    members: [{ user: id }],
  });
  res.status(201).json(project);
});

const getAllProjectList = asyncHandler(async (req, res) => {
  const { id } = req.user;
  const projects = await Project.find({ "members.user": id })
    .populate("projectLead", "name email")
    .populate("createdBy", "name email")
    .populate({
      path: "members",
      populate: {
        path: "user",
        select: "name email",
      },
    });
  res.status(200).json(projects);
});

const getProjectDetails = asyncHandler(async (req, res) => {
  const { id } = req.user;
  const { projectId } = req.params;
  const project = await Project.findById(projectId)
    .populate("projectLead", "name email")
    .populate("createdBy", "name email")
    .populate({
      path: "members",
      populate: {
        path: "user",
        select: "name email",
      },
    });
  if (!project) {
    throw new NotFoundError({
      code: errorCodes.PROJECT_NOT_FOUND,
      message: "Project not found",
    });
  }
  const isUserMember = project.members.some(
    (member) => member.user.id.toString() === id
  );
  if (!isUserMember) {
    throw new UnAuthorisedError({
      code: errorCodes.ACCESS_DENIED,
      message: "Access denied",
    });
  }
  res.status(200).json(project)
});

const invitePeopleToProject = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const { userId, role } = req.body;
  const user = await User.findById(userId);
  if (!user) {
    throw new NotFoundError({
      code: errorCodes.USER_NOT_FOUND,
      message: "Invited user is not found in the database",
    });
  }
  await Project.findByIdAndUpdate(
    projectId,
    {
      $push: { members: { user: userId, role: role } },
    },
    {
      new: true,
    }
  );
  res.status(200).json({ message: "Invitation sent successfully" });
});

module.exports = {
  createNewProject,
  getAllProjectList,
  invitePeopleToProject,
  getProjectDetails,
};
