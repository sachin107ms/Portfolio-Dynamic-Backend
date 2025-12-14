const express = require("express");
const router = express.Router();
const { loginAdmin, createAdmin,logoutAdmin } = require("../controllers/authController");

// Create admin (use once)
// router.post("/create-admin", createAdmin);

// Login
router.post("/login", loginAdmin);
router.post("/logout", logoutAdmin);


module.exports = router;
