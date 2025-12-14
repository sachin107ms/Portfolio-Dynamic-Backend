const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload"); // Keep using the same upload middleware
const authMiddleware = require("../middleware/authMiddleware");
const {
  createOrUpdateAbout,
  getAbout,
  updateResume,
  updateProfileImage,  // NEW
  deleteProfileImage,  // NEW
  deleteResume,
  toggleActiveStatus
} = require("../controllers/aboutController");

// Public route (no authentication needed)
router.get("/", getAbout);

// Protected routes (require authentication)
// KEEPING ORIGINAL ROUTES - using single file upload
router.post("/", authMiddleware, upload.single("file"), createOrUpdateAbout); // Changed from "resumePdf" to "file"
router.put("/", authMiddleware, upload.single("file"), createOrUpdateAbout); // Changed from "resumePdf" to "file"

// Keep original resume routes unchanged
router.patch("/resume", authMiddleware, upload.single("resumePdf"), updateResume);
router.delete("/resume", authMiddleware, deleteResume);

// NEW profile image routes
router.patch("/profile-image", authMiddleware, upload.single("profileImage"), updateProfileImage);
router.delete("/profile-image", authMiddleware, deleteProfileImage);

router.patch("/toggle-active", authMiddleware, toggleActiveStatus);

module.exports = router;