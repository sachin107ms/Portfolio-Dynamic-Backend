const Project = require("../models/Project");
const cloudinary = require("../config/cloudinary");

const safeParseArray = (data, fallback = []) => {
  if (Array.isArray(data)) return data;
  if (typeof data === 'string') {
    try {
      const parsed = JSON.parse(data);
      return Array.isArray(parsed) ? parsed : fallback;
    } catch (error) {
      // If JSON parsing fails, treat it as a single item array
      return data.trim() ? [data] : fallback;
    }
  }
  return fallback;
};
// Add Project
exports.addProject = async (req, res) => {
  try {
    const {
      projectName,
      projectDuration,
      projectDescription,
      projectTechStack,
      projectClient,
      targetAudience,
      projectFeatures,
      projectRole,
      GithubLink,
      projectLink
    } = req.body;

    // Parse array fields if they come as strings
    const parsedProjectDescription = safeParseArray(projectDescription);
    const parsedProjectTechStack = safeParseArray(projectTechStack);
    const parsedTargetAudience = safeParseArray(targetAudience);
    const parsedProjectFeatures = safeParseArray(projectFeatures);

    const newProject = new Project({
      projectName,
      projectDuration,
      projectImage: req.file ? req.file.path : "", // Cloudinary URL
      projectDescription: parsedProjectDescription,
      projectTechStack: parsedProjectTechStack,
      projectClient,
      targetAudience: parsedTargetAudience,
      projectFeatures: parsedProjectFeatures,
      projectRole,
      GithubLink,
      projectLink
    });

    await newProject.save();
    res.status(201).json({ message: "Project added successfully", project: newProject });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get All Projects
exports.getProjects = async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Single Project
exports.getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Project
exports.updateProject = async (req, res) => {
  try {
    const {
      projectName,
      projectDuration,
      projectDescription,
      projectTechStack,
      projectClient,
      targetAudience,
      projectFeatures,
      projectRole,
      GithubLink,
      projectLink
    } = req.body;

    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });

    // Parse array fields if they come as strings
    const parsedProjectDescription = safeParseArray(projectDescription, project.projectDescription);
    const parsedProjectTechStack = safeParseArray(projectTechStack, project.projectTechStack);
    const parsedTargetAudience = safeParseArray(targetAudience, project.targetAudience);
    const parsedProjectFeatures = safeParseArray(projectFeatures, project.projectFeatures);

    // If new image uploaded, replace Cloudinary image
    if (req.file) {
      // Delete old image from Cloudinary if exists
      if (project.projectImage) {
        const publicId = project.projectImage.split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(`projects/${publicId}`);
      }
      project.projectImage = req.file.path;
    }

    // Update fields
    project.projectName = projectName;
    project.projectDuration = projectDuration;
    project.projectDescription = parsedProjectDescription;
    project.projectTechStack = parsedProjectTechStack;
    project.projectClient = projectClient;
    project.targetAudience = parsedTargetAudience;
    project.projectFeatures = parsedProjectFeatures;
    project.projectRole = projectRole;
    project.GithubLink = GithubLink;
    project.projectLink = projectLink;

    await project.save();

    res.json({ message: "Project updated successfully", project });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete Project
exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });

    // Delete image from Cloudinary if exists
    if (project.projectImage) {
      const publicId = project.projectImage.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(`projects/${publicId}`);
    }

    await project.deleteOne();

    res.json({ message: "Project deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};