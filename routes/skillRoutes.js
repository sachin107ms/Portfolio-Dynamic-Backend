const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const authMiddleware = require("../middleware/authMiddleware");
const {
  addSkill,
  getSkills,
  getSkillById,
  updateSkill,
  deleteSkill
} = require("../controllers/skillController");

// Create Skill
router.post("/add-skill",authMiddleware, upload.single("skillIcon"), addSkill);

// Read All Skills
router.get("/", getSkills);

// Read Single Skill
router.get("/:id",authMiddleware, getSkillById);

// Update Skill
router.put("/update/:id",authMiddleware, upload.single("skillIcon"), updateSkill);

// Delete Skill
router.delete("/delete/:id",authMiddleware, deleteSkill);

module.exports = router;
