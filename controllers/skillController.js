const Skill = require("../models/Skill");
const cloudinary = require("../config/cloudinary")
// Add Skill
exports.addSkill = async (req, res) => {
  try {
    const { skillName, skillCategory } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "Skill icon is required" });
    }

    const newSkill = new Skill({
      skillName,
      skillCategory,
      skillIcon: req.file.path // Cloudinary URL
    });

    await newSkill.save();
    res.status(201).json({ message: "Skill added successfully", skill: newSkill });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getSkills = async (req, res) => {
  try {
    const skills = await Skill.find().sort({ createdAt: -1 });
    res.json(skills);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single skill
exports.getSkillById = async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.id);
    if (!skill) return res.status(404).json({ message: "Skill not found" });
    res.json(skill);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Skill
exports.updateSkill = async (req, res) => {
  try {
    const { skillName, skillCategory } = req.body;

    const skill = await Skill.findById(req.params.id);
    if (!skill) return res.status(404).json({ message: "Skill not found" });

    // If new image uploaded, replace Cloudinary image
    if (req.file) {
      const publicId = skill.skillIcon.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(`skills/${publicId}`);
      skill.skillIcon = req.file.path;
    }

    skill.skillName = skillName;
    skill.skillCategory = skillCategory;

    await skill.save();

    res.json({ message: "Skill updated", skill });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete Skill
exports.deleteSkill = async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.id);
    if (!skill) return res.status(404).json({ message: "Skill not found" });

    const publicId = skill.skillIcon.split('/').pop().split('.')[0];
    await cloudinary.uploader.destroy(`skills/${publicId}`);

    await skill.deleteOne();

    res.json({ message: "Skill deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};