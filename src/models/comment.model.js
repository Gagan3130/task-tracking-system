const mongoose = require("mongoose");

const commentModel = mongoose.Schema(
  {
    content: {
      type: String,
      trim: true,
      required: true,
    },
    commentedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    replies: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
  },
  {
    timestamps: true,
  }
);

commentModel.virtual("id").get(function () {
  return this._id;
});

commentModel.set("toJSON", {
  virtuals: true,
  transform: function (doc, ret) {
    delete ret._id;
  },
});

const Comment = mongoose.model("Comment", commentModel);
module.exports = Comment;
