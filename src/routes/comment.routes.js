const express = require("express");
const authMiddleware = require("../middleware/auth.middleware");
const {
  projectUserRoleMiddleware,
  checkTaskMiddleware,
} = require("../middleware/project.middleware");
const {
  postComment,
  postCommentReply,
  getAllTaskComments,
} = require("../controllers/comment.controller");

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .post(
    authMiddleware,
    projectUserRoleMiddleware(["admin", "member", "viewer"]),
    checkTaskMiddleware,
    postComment
  )
  .get(
    authMiddleware,
    projectUserRoleMiddleware(["admin", "member", "viewer"]),
    checkTaskMiddleware,
    getAllTaskComments
  );

router
  .route("/:commentId/reply")
  .post(
    authMiddleware,
    projectUserRoleMiddleware(["admin", "member", "viewer"]),
    checkTaskMiddleware,
    postCommentReply
  );

module.exports = router;
