const mongoose = require("mongoose");
const ApiConstants = require("../config/constants");

const taskModel = mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      required: [true, "task name is required"],
    },
    description: {
      type: String,
      trim: true,
      default: null,
      required: false,
    },
    dueDate: {
      type: Date,
      default: null,
      required: false,
    },
    status: {
      type: String,
      enum: ApiConstants.status,
      default: "open",
      required: false,
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    priority: {
      type: String,
      enum: ApiConstants.priorities,
      default: "medium", // Priority of the task
      required: false,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
      default: null,
    },
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
    attachments: [],
  },
  {
    timestamps: true,
  }
);

taskModel.virtual("id").get(function () {
  return this._id;
});

taskModel.set("toJSON", {
  virtuals: true,
  transform: function (doc, ret) {
    delete ret._id;
  },
});

const Task = mongoose.model("Task", taskModel);
module.exports = Task;
