const asyncHandler = require("express-async-handler");
const { TaskServices } = require("../services/task.service");
const { NotFoundError } = require("../utils/custom-error");
const errorCodes = require("../utils/error-codes");
const { notifyUser } = require("../utils");

const createNewTask = asyncHandler(async (req, res) => {
  const { title, description, dueDate, priority } = req.body;
  const { projectId } = req.params;
  const task = await TaskServices.createTask({
    title,
    description,
    dueDate,
    priority,
    userId: req.user.id,
    project: projectId,
  });
  res.status(201).json(task);
});

const getAllMyTasks = asyncHandler(async (req, res) => {
  const { id } = req.user;
  const { projectId } = req.params;
  const tasks = await TaskServices.retriveTaskAssignedToMe(id, projectId);
  res.status(200).json(tasks);
});

const updateTaskDetails = asyncHandler(async (req, res) => {
  const { taskId, projectId } = req.params;
  const {
    title,
    description,
    dueDate,
    priority,
    status,
    assignedTo,
    attachments,
  } = req.body;
  const task = await TaskServices.findTask(taskId);
  let users = [task.assignedTo];
  if (assignedTo) users.push(assignedTo);
  users = [...new Set(users)];
  if (!task) {
    throw new NotFoundError({
      code: errorCodes.TASK_NOT_FOUND,
      message: "Task not found",
    });
  }
  if (task.project.toString() !== projectId) {
    throw new NotFoundError({
      code: errorCodes.TASK_NOT_FOUND,
      message: "Task not found",
    });
  }
  const response = await TaskServices.updateTaskDetails(taskId, {
    title,
    description,
    dueDate,
    priority,
    status,
    assignedTo,
  });
  for (const userId of users) {
    notifyUser(userId, "Task informations have been changed");
  }
  if (response) res.status(200).json({ message: "task updated successfully" });
});

const getTaskDetails = asyncHandler(async (req, res) => {
  const { taskId, projectId } = req.params;
  const task = await TaskServices.findTask(taskId);
  if (!task) {
    throw new NotFoundError({
      code: errorCodes.TASK_NOT_FOUND,
      message: "Task not found",
    });
  }
  if (task.project.toString() !== projectId) {
    throw new NotFoundError({
      code: errorCodes.TASK_NOT_FOUND,
      message: "Task not found",
    });
  }
  const taskDetails = await TaskServices.fetchTaskDetails(taskId);
  res.status(200).json(taskDetails);
});

const fetchAllTask = asyncHandler(async (req, res) => {
  const { status, search, sortBy = "asc" } = req.query;
  const { projectId } = req.params;
  const tasks = await TaskServices.findAllTaskAndFilter({
    status,
    search,
    sortBy,
    projectId,
  });
  res.status(200).json(tasks);
});

module.exports = {
  createNewTask,
  getAllMyTasks,
  updateTaskDetails,
  getTaskDetails,
  fetchAllTask,
};
