const Experience = require("../models/Experience");
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

// Add Experience
exports.addExperience = async (req, res) => {
  try {
    const {
      companyName,
      workedRole,
      experienceDuration,
      experienceDescription,
      location,
      companyAddress,
      companyType,
      companyWebsite,
      keyResponsibilities,
      technologiesUsed,
      workMode
    } = req.body;

    // Parse array fields
    const parsedExperienceDescription = safeParseArray(experienceDescription);
    const parsedKeyResponsibilities = safeParseArray(keyResponsibilities);
    const parsedTechnologiesUsed = safeParseArray(technologiesUsed);

    const newExperience = new Experience({
      companyName,
      workedRole,
      experienceDuration,
      experienceImage: req.file ? req.file.path : "",
      experienceDescription: parsedExperienceDescription,
      location,
      companyAddress,
      companyType,
      companyWebsite,
      keyResponsibilities: parsedKeyResponsibilities,
      technologiesUsed: parsedTechnologiesUsed,
      workMode
    });

    await newExperience.save();
    res.status(201).json({ message: "Experience added successfully", experience: newExperience });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get All Experiences
exports.getExperiences = async (req, res) => {
  try {
    const experiences = await Experience.find().sort({ createdAt: -1 });
    res.json(experiences);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Single Experience
exports.getExperienceById = async (req, res) => {
  try {
    const experience = await Experience.findById(req.params.id);
    if (!experience) return res.status(404).json({ message: "Experience not found" });
    res.json(experience);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Experience
exports.updateExperience = async (req, res) => {
  try {
    const {
      companyName,
      workedRole,
      experienceDuration,
      experienceDescription,
      location,
      companyAddress,
      companyType,
      companyWebsite,
      keyResponsibilities,
      technologiesUsed,
      workMode
    } = req.body;

    const experience = await Experience.findById(req.params.id);
    if (!experience) return res.status(404).json({ message: "Experience not found" });

    // Parse array fields
    const parsedExperienceDescription = safeParseArray(experienceDescription, experience.experienceDescription);
    const parsedKeyResponsibilities = safeParseArray(keyResponsibilities, experience.keyResponsibilities);
    const parsedTechnologiesUsed = safeParseArray(technologiesUsed, experience.technologiesUsed);

    // If new image uploaded, replace Cloudinary image
    if (req.file) {
      // Delete old image from Cloudinary if exists
      if (experience.experienceImage) {
        const publicId = experience.experienceImage.split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(`experiences/${publicId}`);
      }
      experience.experienceImage = req.file.path;
    }

    // Update fields
    experience.companyName = companyName;
    experience.workedRole = workedRole;
    experience.experienceDuration = experienceDuration;
    experience.experienceDescription = parsedExperienceDescription;
    experience.location = location;
    experience.companyAddress = companyAddress;
    experience.companyType = companyType;
    experience.companyWebsite = companyWebsite;
    experience.keyResponsibilities = parsedKeyResponsibilities;
    experience.technologiesUsed = parsedTechnologiesUsed;
    experience.workMode = workMode;

    await experience.save();

    res.json({ message: "Experience updated successfully", experience });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete Experience
exports.deleteExperience = async (req, res) => {
  try {
    const experience = await Experience.findById(req.params.id);
    if (!experience) return res.status(404).json({ message: "Experience not found" });

    // Delete image from Cloudinary if exists
    if (experience.experienceImage) {
      const publicId = experience.experienceImage.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(`experiences/${publicId}`);
    }

    await experience.deleteOne();

    res.json({ message: "Experience deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};