const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const authMiddleware = require("../middleware/authMiddleware");
const {
  addProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject
} = require("../controllers/projectController");

// Create Project
router.post("/add-project",authMiddleware, upload.single("projectImage"), addProject);

// Read All Projects
router.get("/", getProjects);

// Read Single Project
router.get("/:id",authMiddleware, getProjectById);

// Update Project
router.put("/update/:id",authMiddleware, upload.single("projectImage"), updateProject);

// Delete Project
router.delete("/delete/:id",authMiddleware, deleteProject);

module.exports = router;