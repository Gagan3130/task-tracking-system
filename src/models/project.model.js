const mongoose = require("mongoose");

const projectModel = mongoose.Schema(
  {
    projectName: {
      type: String,
      required: [true, "Team name is required"],
    },
    members: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        role: {
          type: String,
          enum: ["admin", "member", "viewer"],
          default: "member",
        },
      },
    ],
    projectLead: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Team lead cannot be left empty"],
    },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  {
    timestamps: true,
  }
);

// projectModel.virtual("id").get(function () {
//   return this._id;
// });

// projectModel.set("toJSON", {
//   virtuals: true,
//   transform: function (doc, ret) {
//     delete ret._id;
//   },
// });

const Project = mongoose.model("Project", projectModel);
module.exports = Project;
