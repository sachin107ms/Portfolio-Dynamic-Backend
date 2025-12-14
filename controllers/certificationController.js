const Certification = require("../models/Certification");
const cloudinary = require("../config/cloudinary");

// Helper function to safely parse array fields
const safeParseArray = (data, fallback = []) => {
  if (Array.isArray(data)) return data;
  if (typeof data === 'string') {
    try {
      const parsed = JSON.parse(data);
      return Array.isArray(parsed) ? parsed : fallback;
    } catch (error) {
      // If JSON parsing fails, treat it as a single item array
      return data.trim() ? [data] : fallback;
    }
  }
  return fallback;
};

// Add Certification
exports.addCertification = async (req, res) => {
  try {
    const {
      courseName,
      courseMode,
      courseProvider,
      courseDuration,
      courseCompletedDate,
      keyLearnings
    } = req.body;

    // Parse array fields
    const parsedKeyLearnings = safeParseArray(keyLearnings);

    const newCertification = new Certification({
      courseName,
      courseMode,
      courseProvider,
      courseDuration,
      courseCompletedDate,
      keyLearnings: parsedKeyLearnings,
      certificatePdf: req.file ? req.file.path : ""
    });

    await newCertification.save();
    res.status(201).json({ 
      message: "Certification added successfully", 
      certification: newCertification 
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get All Certifications
exports.getCertifications = async (req, res) => {
  try {
    const certifications = await Certification.find().sort({ courseCompletedDate: -1 });
    res.json(certifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Single Certification
exports.getCertificationById = async (req, res) => {
  try {
    const certification = await Certification.findById(req.params.id);
    if (!certification) return res.status(404).json({ message: "Certification not found" });
    res.json(certification);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Certification
exports.updateCertification = async (req, res) => {
  try {
    const {
      courseName,
      courseMode,
      courseProvider,
      courseDuration,
      courseCompletedDate,
      keyLearnings
    } = req.body;

    const certification = await Certification.findById(req.params.id);
    if (!certification) return res.status(404).json({ message: "Certification not found" });

    // Parse array fields
    const parsedKeyLearnings = safeParseArray(keyLearnings, certification.keyLearnings);

    // If new PDF uploaded, replace Cloudinary file
    if (req.file) {
      // Delete old PDF from Cloudinary if exists
      if (certification.certificatePdf) {
        const publicId = certification.certificatePdf.split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(`certifications/${publicId}`);
      }
      certification.certificatePdf = req.file.path;
    }

    // Update fields
    certification.courseName = courseName;
    certification.courseMode = courseMode;
    certification.courseProvider = courseProvider;
    certification.courseDuration = courseDuration;
    certification.courseCompletedDate = courseCompletedDate;
    certification.keyLearnings = parsedKeyLearnings;

    await certification.save();

    res.json({ 
      message: "Certification updated successfully", 
      certification 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete Certification
exports.deleteCertification = async (req, res) => {
  try {
    const certification = await Certification.findById(req.params.id);
    if (!certification) return res.status(404).json({ message: "Certification not found" });

    // Delete PDF from Cloudinary if exists
    if (certification.certificatePdf) {
      const publicId = certification.certificatePdf.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(`certifications/${publicId}`);
    }

    await certification.deleteOne();

    res.json({ message: "Certification deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};