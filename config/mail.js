const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER,   // yourgmail@gmail.com
    pass: process.env.MAIL_PASS    // 16-digit app password
  },
});

module.exports = transporter;
