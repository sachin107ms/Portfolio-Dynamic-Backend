const mongoose = require("mongoose");

const certificationSchema = new mongoose.Schema(
  {
    courseName: { type: String, required: true },
    courseMode: { type: String, required: true },
    courseProvider: { type: String },
    courseDuration: { type: String },
    courseCompletedDate: { type: Date },
    keyLearnings: [{ type: String }],
    certificatePdf: { type: String } // Cloudinary URL for PDF
  },
  { timestamps: true }
);

module.exports = mongoose.model("Certification", certificationSchema);