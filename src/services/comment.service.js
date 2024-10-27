const Comment = require("../models/comment.model");
const Task = require("../models/task.model");
const { TaskServices } = require("./task.service");

class CommentServices {
  async postNewComment({ content, userId, taskId }) {
    const comment = await Comment.create({
      content: content,
      commentedBy: userId,
      task: taskId,
    });
    await TaskServices.addCommentsToTask({ taskId, commentId: comment.id });
    return comment;
  }

  async postCommentReply({ content, commentedBy, taskId, parentComment }) {
    const repliedComment = await Comment.create({
      content: content,
      commentedBy,
      task: taskId,
      parentComment,
    });
    const comment = await Comment.findByIdAndUpdate(
      parentComment,
      {
        $push: { replies: repliedComment.id },
      },
      { new: true }
    );
    return comment;
  }

  async getAllTaskComments(taskId) {
    const task = await Task.findById(taskId).populate("comments");
    for (let comment of task.comments) {
      await populateRepliesRecursively(comment);
    }
    return task.comments;
  }

  async findComment(commentId) {
    return await Comment.findById(commentId);
  }

  async removeComment({comment, taskId}){
    if (comment.parentComment) {
        const parentComment = await this.findComment(comment.parentComment)
        const replies = parentComment.replies.filter(
          (id) => id.toString() !== comment.id
        );
        await Comment.findByIdAndUpdate(comment.parentComment, { replies });
      } else {
        const task = await Task.findById(taskId);
        const taskComments = task.comments.filter(
          (id) => id.toString() !== comment.id
        );
        await Task.findByIdAndUpdate(taskId, { comments: taskComments });
      }
  }
}

const CommentService = new CommentServices();
module.exports = { CommentService };
