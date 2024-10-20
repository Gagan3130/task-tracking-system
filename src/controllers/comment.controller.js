const expressAsyncHandler = require("express-async-handler");
const Comment = require("../models/comment.model");
const Task = require("../models/task.model");
const { NotFoundError } = require("../utils/custom-error");
const errorCodes = require("../utils/error-codes");
const { populateRepliesRecursively } = require("../utils");

const postComment = expressAsyncHandler(async (req, res) => {
  const { content } = req.body;
  const { taskId } = req.params;
  const comment = await Comment.create({
    content: content,
    commentedBy: req.user.id,
    task: taskId,
  });
  await Task.findByIdAndUpdate(taskId, {
    $push: { comments: comment.id },
  });
  res.status(201).json(comment);
});

const postCommentReply = expressAsyncHandler(async (req, res) => {
  const { commentId, taskId } = req.params;
  const { content } = req.body;
  const comment = await Comment.findById(commentId);
  if (!comment) {
    throw new NotFoundError({
      code: errorCodes.COMMENT_NOT_FOUND,
      message: `Comment with comment id ${commentId} does not exist`,
    });
  }
  if (comment.task.toString() !== taskId) {
    throw new NotFoundError({
      code: errorCodes.COMMENT_NOT_FOUND,
      message: "commentId is not associated with the task",
    });
  }
  const repliedComment = await Comment.create({
    content: content,
    commentedBy: req.user.id,
    task: taskId,
    parentComment: commentId,
  });
  const comm = await Comment.findByIdAndUpdate(
    commentId,
    {
      $push: { replies: repliedComment.id },
    },
    { new: true }
  );
  res.status(201).json(comm);
});

const getAllTaskComments = expressAsyncHandler(async (req, res) => {
  const { taskId } = req.params;
  let task = await Task.findById(taskId).populate("comments");
  for (let comment of task.comments) {
    await populateRepliesRecursively(comment);
  }
  res.status(200).json(task.comments);
});

const removeComment = expressAsyncHandler(async (req, res) => {
  const { commentId, taskId } = req.params;
  const comment = await Comment.findById(commentId);
  if (!comment) {
    throw new NotFoundError({
      code: errorCodes.COMMENT_NOT_FOUND,
      message: `Comment with comment id ${commentId} does not exist`,
    });
  }
  if (comment.task.toString() !== taskId) {
    throw new NotFoundError({
      code: errorCodes.COMMENT_NOT_FOUND,
      message: "commentId is not associated with the task",
    });
  }
  if (comment.parentComment) {
    const parentComment = await Comment.findById(comment.parentComment);
    const replies = parentComment.replies.filter((id) => id.toString() !== comment.id);
    await Comment.findByIdAndUpdate(comment.parentComment, { replies });
  } else {
    const task = await Task.findById(taskId);
    const taskComments = task.comments.filter((id) => id.toString() !== comment.id);
    await Task.findByIdAndUpdate(taskId, { comments: taskComments });
  }
  res.status(200).json({ msg: "Comment deleted successfully" });
});

module.exports = {
  postComment,
  postCommentReply,
  getAllTaskComments,
  removeComment,
};
