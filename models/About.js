const mongoose = require("mongoose");

const aboutSchema = new mongoose.Schema(
    {
        role: {
            type: String,
            required: true,
            trim: true
        },
        description: [{
            type: String,
            trim: true
        }],
        quote: {  // NEW FIELD
            type: String,
            trim: true,
            default: ""
        },
        profileImage: {  // NEW FIELD
            type: String // Cloudinary URL for profile image
        },
        resumePdf: {
            type: String // Cloudinary URL for PDF
        },
        contactEmail: {
            type: String,
            trim: true,
            lowercase: true
        },
        contactPhone: {
            type: String,
            trim: true
        },
        address:{
            type: String,
            trim: true
        },
        socialLinks: {
            linkedin: { type: String, trim: true },
            github: { type: String, trim: true },
            twitter: { type: String, trim: true },
            instagram: { type: String, trim: true },
            portfolio: { type: String, trim: true }
        },
        isActive: {
            type: Boolean,
            default: true
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("About", aboutSchema);