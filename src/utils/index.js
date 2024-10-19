const jwt = require("jsonwebtoken");

const generateJwtToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET_KEY, {
    expiresIn: "30d",
  });
};

const decodeJwtToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET_KEY);
};

const populateRepliesRecursively = async (comment) => {
  await comment.populate({
    path: "commentedBy",
    select: "name email",
  });

  if (comment.replies && comment.replies.length > 0) {
    await comment.populate({
      path: "replies",
      populate: { path: "commentedBy", select: "name email" },
    });

    for (let reply of comment.replies) {
      await populateRepliesRecursively(reply); // Recursively populate the replies of replies
    }
  }
};

module.exports = { generateJwtToken, decodeJwtToken, populateRepliesRecursively };
