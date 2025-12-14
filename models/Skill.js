const mongoose = require("mongoose");

const skillSchema = new mongoose.Schema(
  {
    skillName: { type: String, required: true },
    skillIcon: { type: String, required: true }, // Cloudinary URL
    skillCategory: { type: String, required: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Skill", skillSchema);
