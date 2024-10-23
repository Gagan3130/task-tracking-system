const Project = require("../models/project.model");

class ProjectServices {
  async createProject({ projectName, projectLead, createdBy, members }) {
    const project = await Project.create({
      projectName,
      projectLead,
      createdBy,
      members,
    });
    return project;
  }

  async getAllUserProjects(userId) {
    const projects = await Project.find({ "members.user": userId })
      .populate("projectLead", "name email")
      .populate("createdBy", "name email")
      .populate({
        path: "members",
        populate: {
          path: "user",
          select: "name email",
        },
      });
    return projects;
  }

  async inviteUsersToProject({ projectId, userId, role }) {
    await Project.findByIdAndUpdate(
      projectId,
      {
        $push: { members: { user: userId, role: role } },
      },
      {
        new: true,
      }
    );
  }
}

const ProjectService = new ProjectServices();
module.exports = { ProjectService };
