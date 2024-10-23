const expressAsyncHandler = require("express-async-handler");
const { NotFoundError } = require("../utils/custom-error");
const errorCodes = require("../utils/error-codes");
const { CommentService } = require("../services/comment.service");

const postComment = expressAsyncHandler(async (req, res) => {
  const { content } = req.body;
  const { taskId } = req.params;
  const comment = await CommentService.postNewComment({
    content,
    userId: req.user.id,
    taskId,
  });
  res.status(201).json(comment);
});

const postCommentReply = expressAsyncHandler(async (req, res) => {
  const { commentId, taskId } = req.params;
  const { content } = req.body;
  const comment = await CommentService.findComment(commentId);
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
  const repliedComment = await CommentService.postCommentReply({
    commentedBy: req.user.id,
    taskId,
    content,
    parentComment: commentId,
  });
  res.status(201).json(repliedComment);
});

const getAllTaskComments = expressAsyncHandler(async (req, res) => {
  const { taskId } = req.params;
  const comments = await CommentService.getAllTaskComments(taskId);
  res.status(200).json(comments);
});

const removeComment = expressAsyncHandler(async (req, res) => {
  const { commentId, taskId } = req.params;
  const comment = await CommentService.findComment(commentId);
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
  await CommentService.removeComment(comment);
  res.status(200).json({ msg: "Comment deleted successfully" });
});

module.exports = {
  postComment,
  postCommentReply,
  getAllTaskComments,
  removeComment,
};
