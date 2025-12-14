const express = require("express");
const router = express.Router();
const { submitContactForm, getAllContacts,
    getContactById,
    deleteContact,
    deleteMultipleContacts, } = require("../controllers/contactController");
const authMiddleware = require("../middleware/authMiddleware");

// Submit Contact Form
router.post("/submit", submitContactForm);
// NEW: Get all contact submissions
router.get("/",authMiddleware, getAllContacts);

// NEW: Get single contact by ID
router.get("/:id",authMiddleware, getContactById);

// NEW: Delete single contact
router.delete("/:id",authMiddleware, deleteContact);

// NEW: Delete multiple contacts
router.delete("/",authMiddleware, deleteMultipleContacts);

module.exports = router;
