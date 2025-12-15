const Contact = require("../models/Contact");
const tranEmailApi = require("../config/mail");

exports.submitContactForm = async (req, res) => {
    try {
        const { name, email, phone, message, companyName, companyWebsite } = req.body;

        // Save to DB
        const contact = new Contact({
            name,
            email,
            phone,
            message,
            companyName,
            companyWebsite
        });

        await contact.save();

        // ============================
        // Email to YOU
        // ============================
       await tranEmailApi.sendTransacEmail({
      sender: {
        email: process.env.MAIL_SENDER,
        name: "Portfolio Contact",
      },
      to: [
        {
          email: process.env.MAIL_SENDER,
        },
      ],
      subject: `New Contact Form Submission - ${name}`,
      htmlContent: `
        <h2>New Contact Form Message</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Company Name:</strong> ${companyName || "N/A"}</p>
        <p><strong>Company Website:</strong> ${companyWebsite || "N/A"}</p>
        <p><strong>Message:</strong><br/> ${message}</p>
      `,
    });

    // =========================
    // Auto-reply to USER
    // =========================
    await tranEmailApi.sendTransacEmail({
      sender: {
        email: process.env.MAIL_SENDER,
        name: "Sachin Portfolio",
      },
      to: [
        {
          email,
        },
      ],
      subject: "Thank you for contacting me!",
      htmlContent: `
        <h3>Hello ${name},</h3>
        <p>Thank you for reaching out!</p>
        <p>I’ve received your message and will get back to you shortly.</p>
        <br/>
        <p>Best Regards,</p>
        <strong>Sachin M</strong>
      `,
    });

    res.status(201).json({ message: "Message sent successfully!" });

    } catch (error) {
        console.error("CONTACT FORM ERROR:", error);
        res.status(500).json({
            message: error.message || "Something went wrong while sending the message.",
        });
    }
};

// NEW: Get all contact submissions (with optional pagination)
exports.getAllContacts = async (req, res) => {
    try {
        const { page = 1, limit = 20, search } = req.query;
        
        let query = {};
        
        // Search functionality (optional)
        if (search) {
            query = {
                $or: [
                    { name: { $regex: search, $options: 'i' } },
                    { email: { $regex: search, $options: 'i' } },
                    { companyName: { $regex: search, $options: 'i' } }
                ]
            };
        }
        
        // Get total count for pagination info
        const total = await Contact.countDocuments(query);
        
        // Fetch contacts with pagination, sorted by latest first
        const contacts = await Contact.find(query)
            .sort({ createdAt: -1 }) // Latest first
            .limit(limit * 1) // Convert to number
            .skip((page - 1) * limit)
            .select('-__v'); // Exclude version key
        
        res.status(200).json({
            success: true,
            data: contacts,
            pagination: {
                total,
                page: parseInt(page),
                limit: parseInt(limit),
                totalPages: Math.ceil(total / limit)
            }
        });
        
    } catch (error) {
        console.error("GET CONTACTS ERROR:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching contact submissions."
        });
    }
};

// NEW: Get single contact by ID
exports.getContactById = async (req, res) => {
    try {
        const { id } = req.params;
        
        const contact = await Contact.findById(id).select('-__v');
        
        if (!contact) {
            return res.status(404).json({
                success: false,
                message: "Contact submission not found."
            });
        }
        
        res.status(200).json({
            success: true,
            data: contact
        });
        
    } catch (error) {
        console.error("GET CONTACT BY ID ERROR:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching contact submission."
        });
    }
};

// NEW: Delete contact submission
exports.deleteContact = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Check if contact exists
        const contact = await Contact.findById(id);
        
        if (!contact) {
            return res.status(404).json({
                success: false,
                message: "Contact submission not found."
            });
        }
        
        // Delete contact
        await Contact.findByIdAndDelete(id);
        
        res.status(200).json({
            success: true,
            message: "Contact submission deleted successfully."
        });
        
    } catch (error) {
        console.error("DELETE CONTACT ERROR:", error);
        res.status(500).json({
            success: false,
            message: "Error deleting contact submission."
        });
    }
};

// NEW: Delete multiple contacts
exports.deleteMultipleContacts = async (req, res) => {
    try {
        const { ids } = req.body;
        
        if (!Array.isArray(ids) || ids.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Please provide an array of contact IDs to delete."
            });
        }
        
        // Delete multiple contacts
        const result = await Contact.deleteMany({ _id: { $in: ids } });
        
        res.status(200).json({
            success: true,
            message: `${result.deletedCount} contact submission(s) deleted successfully.`
        });
        
    } catch (error) {
        console.error("DELETE MULTIPLE CONTACTS ERROR:", error);
        res.status(500).json({
            success: false,
            message: "Error deleting contact submissions."
        });
    }
};

