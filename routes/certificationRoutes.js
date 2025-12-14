const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const authMiddleware = require("../middleware/authMiddleware");
const {
  addCertification,
  getCertifications,
  getCertificationById,
  updateCertification,
  deleteCertification
} = require("../controllers/certificationController");

// Create Certification
router.post("/add-certification",authMiddleware, upload.single("certificatePdf"), addCertification);

// Read All Certifications
router.get("/", getCertifications);

// Read Single Certification
router.get("/:id",authMiddleware, getCertificationById);

// Update Certification
router.put("/update/:id",authMiddleware, upload.single("certificatePdf"), updateCertification);

// Delete Certification
router.delete("/delete/:id",authMiddleware, deleteCertification);

module.exports = router;