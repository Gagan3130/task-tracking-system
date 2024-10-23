const Task = require("../models/task.model");

class TaskService {
  async createTask({ title, description, dueDate, priority, userId, project }) {
    const task = await Task.create({
      title,
      description,
      dueDate,
      priority,
      createdBy: userId,
      project,
    });
    return task;
  }

  async retriveTaskAssignedToMe(userId, projectId) {
    return await Task.find({
      $and: [{ assignedTo: userId }, { project: projectId }],
    });
  }

  async findAllTaskAndFilter({ status, search, sortBy, projectId }) {
    let query = { project: projectId };
    if (status) {
      query.status = status;
    }
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } }, // Case-insensitive search
        { description: { $regex: search, $options: "i" } },
      ];
    }
    return await Task.find(query).sort({
      createdAt: sortBy === "desc" ? -1 : 1,
    });
  }

  async fetchTaskDetails(taskId) {
    return await Task.findById(taskId)
      .populate("assignedTo", "name email id")
      .populate("createdBy", "name email id")
      .populate("project", "projectName")
      .populate({
        path: "comments",
        populate: {
          path: "replies",
        },
        populate: {
          path: "commentedBy",
        },
      });
  }

  async findTask(taskId) {
    return await Task.findById(taskId);
  }

  async updateTaskDetails(
    taskId,
    { title, description, dueDate, priority, status, assignedTo }
  ) {
    return await Task.findByIdAndUpdate(taskId, {
      title,
      description,
      dueDate,
      priority,
      status,
      assignedTo,
    });
  }

  async addCommentsToTask({ taskId, commentId }) {
    await Task.findByIdAndUpdate(taskId, {
      $push: { comments: commentId },
    });
  }
}

const TaskServices = new TaskService();

module.exports = { TaskServices };
