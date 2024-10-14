const expressAsyncHandler = require("express-async-handler");
const Project = require("../models/project.model");
const { UnAuthorisedError } = require("../utils/custom-error");
const errorCodes = require("../utils/error-codes");

const projectUserRoleMiddleware = (roles) => {
  return expressAsyncHandler(async (req, res, next) => {
    const { projectId } = req.params;
    const { id } = req.user;
    const project = await Project.findById(projectId);
    if (!project) {
      throw new NotFoundError({
        code: errorCodes.PROJECT_NOT_FOUND,
        message: "Project not found",
      });
    }
    const userMember = project.members.find(
      (member) => member.user.toString() === id
    );
    if (!userMember) {
      throw new UnAuthorisedError({
        code: errorCodes.ACCESS_DENIED,
        message: "Access denied",
      });
    }
    if (!roles.includes(userMember.role)) {
      throw new UnAuthorisedError({
        code: errorCodes.ACCESS_DENIED,
        message: "Access denied",
      });
    }
    next();
  });
};

module.exports = {projectUserRoleMiddleware};
