const expressAsyncHandler = require("express-async-handler");
const Project = require("../models/project.model");
const { UnAuthorisedError, NotFoundError } = require("../utils/custom-error");
const errorCodes = require("../utils/error-codes");
const { TaskServices } = require("../services/task.service");

const projectUserRoleMiddleware = (roles) => {
  return expressAsyncHandler(async (req, res, next) => {
    const { projectId } = req.params;
    const { id } = req.user;
    const project = await Project.findById(projectId);
    if (!project) {
      // check if project exist
      throw new NotFoundError({
        code: errorCodes.PROJECT_NOT_FOUND,
        message: "Project not found",
      });
    }
    const userMember = project.members.find(
      // check the user that is requesting for a resource is member of that project or have the valid role for that resource
      (member) => member.user.toString() === id
    );
    if (!userMember || !roles.includes(userMember.role)) {
      throw new UnAuthorisedError({
        code: errorCodes.ACCESS_DENIED,
        message: "Access denied",
      });
    }
    next();
  });
};

const checkTaskMiddleware = expressAsyncHandler(async (req, res, next) => {
  const { taskId, projectId } = req.params;
  const task = await TaskServices.findTask(taskId);
  if (!task) { // check if task exist 
    throw new NotFoundError({
      code: errorCodes.TASK_NOT_FOUND,
      message: "Task not found",
    });
  }
  if (task.project.toString() !== projectId) { // check if that task is part of the same project 
    throw new NotFoundError({
      code: errorCodes.TASK_NOT_FOUND,
      message: "Task not found",
    });
  }
  next()
});

module.exports = { projectUserRoleMiddleware, checkTaskMiddleware };
