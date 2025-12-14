const About = require("../models/About");
const cloudinary = require("../config/cloudinary");

// Helper function to safely parse array fields
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

// Helper function to safely parse social links
const safeParseSocialLinks = (data) => {
  if (typeof data === 'string') {
    try {
      return JSON.parse(data);
    } catch (error) {
      return {};
    }
  }
  return data || {};
};

// Create or Update About (Only one document should exist)
exports.createOrUpdateAbout = async (req, res) => {
  try {
    const {
      role,
      description,
      quote,  // NEW FIELD
      contactEmail,
      contactPhone,
      address,
      socialLinks
    } = req.body;

    // Parse description array field
    const parsedDescription = safeParseArray(description);
    
    // Parse social links if provided as string
    const parsedSocialLinks = safeParseSocialLinks(socialLinks);

    // Check if about document already exists
    let about = await About.findOne();

    // If no document exists, create one
    if (!about) {
      about = new About({
        role,
        description: parsedDescription,
        quote: quote || "",  // NEW FIELD
        contactEmail,
        contactPhone,
        address,
        socialLinks: parsedSocialLinks
      });
    } else {
      // Update existing document
      about.role = role || about.role;
      about.description = parsedDescription.length > 0 ? parsedDescription : about.description;
      about.quote = quote !== undefined ? quote : about.quote;  // NEW FIELD
      about.contactEmail = contactEmail || about.contactEmail;
      about.contactPhone = contactPhone || about.contactPhone;
      about.address = address || about.address;
      
      // Merge existing social links with new ones
      about.socialLinks = {
        ...about.socialLinks,
        ...parsedSocialLinks
      };
    }

    // Handle resume PDF upload (KEEPING ORIGINAL CODE)
    if (req.file) {
      // Check if uploaded file is PDF (for resume) or image (for profile)
      const fileType = req.file.mimetype;
      
      if (fileType === 'application/pdf') {
        // Delete old resume from Cloudinary if exists
        if (about.resumePdf) {
          const publicId = about.resumePdf.split('/').pop().split('.')[0];
          try {
            await cloudinary.uploader.destroy(`resumes/${publicId}`);
          } catch (cloudinaryError) {
            console.error('Error deleting old resume:', cloudinaryError);
          }
        }
        about.resumePdf = req.file.path;
      } else if (fileType.startsWith('image/')) {
        // Handle profile image upload
        // Delete old profile image from Cloudinary if exists
        if (about.profileImage) {
          const publicId = about.profileImage.split('/').pop().split('.')[0];
          try {
            await cloudinary.uploader.destroy(`profile-images/${publicId}`);
          } catch (cloudinaryError) {
            console.error('Error deleting old profile image:', cloudinaryError);
          }
        }
        about.profileImage = req.file.path;
      }
    }

    await about.save();

    res.status(200).json({ 
      message: "About section updated successfully", 
      about 
    });

  } catch (error) {
    console.error('Error in createOrUpdateAbout:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get About Information
exports.getAbout = async (req, res) => {
  try {
    const about = await About.findOne({ isActive: true });
    
    if (!about) {
      return res.status(404).json({ 
        message: "About information not found",
        about: {
          role: "Your Role",
          quote: "",  // NEW FIELD
          description: ["Add your description here"],
          profileImage: "",  // NEW FIELD
          contactEmail: "",
          contactPhone: "",
          address:"",
          socialLinks: {},
          resumePdf: ""
        }
      });
    }
    
    // Ensure description is always returned as an array
    const formattedAbout = about.toObject();
    formattedAbout.description = safeParseArray(formattedAbout.description, []);
    
    res.json(formattedAbout);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Resume Only (KEEPING ORIGINAL CODE)
exports.updateResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Resume PDF is required" });
    }

    let about = await About.findOne();
    
    // If no about document exists, create one with basic info
    if (!about) {
      about = new About({
        role: "Your Role",
        quote: "",  // NEW FIELD
        description: ["Add your description here"],
        resumePdf: req.file.path
      });
    } else {
      // Delete old resume from Cloudinary if exists
      if (about.resumePdf) {
        const publicId = about.resumePdf.split('/').pop().split('.')[0];
        try {
          await cloudinary.uploader.destroy(`resumes/${publicId}`);
        } catch (cloudinaryError) {
          console.error('Error deleting old resume:', cloudinaryError);
        }
      }
      about.resumePdf = req.file.path;
    }

    await about.save();

    res.json({ 
      message: "Resume updated successfully", 
      resumeUrl: about.resumePdf 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// NEW: Update Profile Image Only
exports.updateProfileImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Profile image is required" });
    }

    // Check if uploaded file is an image
    if (!req.file.mimetype.startsWith('image/')) {
      return res.status(400).json({ message: "Only image files are allowed for profile image" });
    }

    let about = await About.findOne();
    
    // If no about document exists, create one with basic info
    if (!about) {
      about = new About({
        role: "Your Role",
        quote: "",
        description: ["Add your description here"],
        profileImage: req.file.path
      });
    } else {
      // Delete old profile image from Cloudinary if exists
      if (about.profileImage) {
        const publicId = about.profileImage.split('/').pop().split('.')[0];
        try {
          await cloudinary.uploader.destroy(`profile-images/${publicId}`);
        } catch (cloudinaryError) {
          console.error('Error deleting old profile image:', cloudinaryError);
        }
      }
      about.profileImage = req.file.path;
    }

    await about.save();

    res.json({ 
      message: "Profile image updated successfully", 
      profileImageUrl: about.profileImage 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// NEW: Delete Profile Image
exports.deleteProfileImage = async (req, res) => {
  try {
    const about = await About.findOne();
    if (!about) {
      return res.status(404).json({ message: "About information not found" });
    }

    if (!about.profileImage) {
      return res.status(400).json({ message: "No profile image found to delete" });
    }

    // Delete image from Cloudinary
    const publicId = about.profileImage.split('/').pop().split('.')[0];
    await cloudinary.uploader.destroy(`profile-images/${publicId}`);

    // Remove profile image URL from database
    about.profileImage = null;
    await about.save();

    res.json({ message: "Profile image deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete Resume (KEEPING ORIGINAL CODE)
exports.deleteResume = async (req, res) => {
  try {
    const about = await About.findOne();
    if (!about) {
      return res.status(404).json({ message: "About information not found" });
    }

    if (!about.resumePdf) {
      return res.status(400).json({ message: "No resume found to delete" });
    }

    // Delete PDF from Cloudinary
    const publicId = about.resumePdf.split('/').pop().split('.')[0];
    await cloudinary.uploader.destroy(`resumes/${publicId}`);

    // Remove resume URL from database
    about.resumePdf = null;
    await about.save();

    res.json({ message: "Resume deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Toggle Active Status (Admin only)
exports.toggleActiveStatus = async (req, res) => {
  try {
    const about = await About.findOne();
    if (!about) {
      return res.status(404).json({ message: "About information not found" });
    }

    about.isActive = !about.isActive;
    await about.save();

    res.json({ 
      message: `About section ${about.isActive ? 'activated' : 'deactivated'} successfully`, 
      isActive: about.isActive 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};