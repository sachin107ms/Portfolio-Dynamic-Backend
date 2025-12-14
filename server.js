const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
require("dotenv").config();

const app = express();

app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://your-frontend.vercel.app"
  ],
  credentials: true
}));
app.use(express.json());

// Connect DB
connectDB();

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

const PORT = process.env.PORT || 5000;

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use('/api/about', require("./routes/aboutRoutes"));
app.use("/api/skills", require("./routes/skillRoutes"));
app.use("/api/contact", require("./routes/contactRoutes"));
app.use("/api/projects", require("./routes/projectRoutes"));
app.use("/api/experiences", require("./routes/experienceRoutes"));
app.use("/api/certifications", require("./routes/certificationRoutes"));

app.listen(PORT, () => console.log("Server running on port 5000"));
