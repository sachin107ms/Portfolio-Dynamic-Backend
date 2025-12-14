const multer = require("multer");
const cloudinary = require("../config/cloudinary");
const { CloudinaryStorage } = require("multer-storage-cloudinary");

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    const timestamp = Date.now();
    const originalName = file.originalname.split('.')[0];

    if (file.mimetype === "application/pdf") {
      return {
        folder: "certifications",
        public_id: `${timestamp}-${originalName}`,
        format: "pdf",             // <--- MUST KEEP PDF EXTENSION
        resource_type: "raw",      // <--- MUST BE RAW FOR PDF VIEWING
        type: "upload"
      };
    }

    return {
      folder: "skills",
      public_id: `${timestamp}-${originalName}`,
      resource_type: "image",
      type: "upload"
    };
  }
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype.startsWith("image/") ||
    file.mimetype === "application/pdf"
  ) {
    cb(null, true);
  } else {
    cb(new Error("Only images and PDFs allowed!"), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 },
});

module.exports = upload;
