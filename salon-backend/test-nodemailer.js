import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  // Adding debug and logger to see exactly what fails
  logger: true,
  debug: true,
});

const mailOptions = {
  from: `"Glow & Grace" <${process.env.EMAIL_USER}>`,
  to: process.env.EMAIL_USER,
  subject: "Nodemailer Debug Test",
  text: "Testing SMTP connection...",
};

console.log(`Attempting to login via SMTP with user: ${process.env.EMAIL_USER}`);

transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    console.error("\n❌ NODEMAILER FAILED:");
    console.error(error.message);
  } else {
    console.log("\n✅ NODEMAILER SUCCESS!");
    console.log("Email sent: " + info.response);
  }
});
