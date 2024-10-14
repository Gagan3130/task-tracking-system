const expressAsyncHandler = require("express-async-handler");
const Project = require("../models/project.model");

const checkUserAssociatedWithProject = expressAsyncHandler(
  async (req, res, next) => {
    const { projectId } = req.params;
    const {id} = req.user
    const project = await Project.findById(projectId);
    if (!project) {
      throw new NotFoundError({
        code: errorCodes.PROJECT_NOT_FOUND,
        message: "Project not found",
      });
    }
    const isUserMember = project.members.some(
      (member) => member.user.toString() === id
    );
    if (!isUserMember) {
      throw new UnAuthorisedError({
        code: errorCodes.ACCESS_DENIED,
        message: "Access denied",
      });
    }
    next()
  }
);

module.exports = checkUserAssociatedWithProject