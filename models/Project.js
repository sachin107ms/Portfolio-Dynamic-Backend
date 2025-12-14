const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    projectName: { type: String, required: true },
    projectDuration: { type: String },
    projectImage: { type: String }, // Cloudinary URL
    projectDescription: [{ type: String }],
    projectTechStack: [{ type: String }],
    projectClient: { type: String },
    targetAudience: [{ type: String }],
    projectFeatures: [{ type: String }],
    projectRole: { type: String },
    GithubLink: { type: String },
    projectLink: { type: String }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Project", projectSchema);