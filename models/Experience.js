const mongoose = require("mongoose");

const experienceSchema = new mongoose.Schema(
  {
    companyName: { type: String, required: true },
    workedRole: { type: String },
    experienceDuration: { type: String },
    experienceDescription: [{ type: String }],
    experienceImage: { type: String }, // Cloudinary URL
    location: { type: String },
    companyAddress: { type: String },
    companyType: { type: String },
    companyWebsite: { type: String },
    keyResponsibilities: [{ type: String }],
    technologiesUsed: [{ type: String }],
    workMode: { type: String, enum: ['On-site', 'Remote', 'Hybrid'] }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Experience", experienceSchema);