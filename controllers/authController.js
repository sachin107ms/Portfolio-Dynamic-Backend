const Admin = require("../models/Admin");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Login Admin
exports.loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.json({ success: true, token, user: {
        email: admin.email,
        name: admin.name || email.split('@')[0], // Fallback to username part of email
      } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Logout Admin
exports.logoutAdmin = async (req, res) => {
  try {
    // Clear the cookie by setting expiry to past date
    res.clearCookie("token", {
      httpOnly: true,
      secure: true,
      sameSite: "none"
    });

    return res.json({ success: true, message: "Logged out successfully" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Create Admin (Run once then delete)
exports.createAdmin = async (req, res) => {
  const { email, password } = req.body;

  const hashed = await bcrypt.hash(password, 10);
  await Admin.create({ email, password: hashed });

  res.json({ message: "Admin created" });
};
