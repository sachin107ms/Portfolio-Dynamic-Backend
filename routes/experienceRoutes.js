const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const authMiddleware = require("../middleware/authMiddleware");
const {
  addExperience,
  getExperiences,
  getExperienceById,
  updateExperience,
  deleteExperience
} = require("../controllers/experienceController");

// Create Experience
router.post("/add-experience",authMiddleware, upload.single("experienceImage"), addExperience);

// Read All Experiences
router.get("/", getExperiences);

// Read Single Experience
router.get("/:id",authMiddleware, getExperienceById);

// Update Experience
router.put("/update/:id",authMiddleware, upload.single("experienceImage"), updateExperience);

// Delete Experience
router.delete("/delete/:id",authMiddleware, deleteExperience);

module.exports = router;