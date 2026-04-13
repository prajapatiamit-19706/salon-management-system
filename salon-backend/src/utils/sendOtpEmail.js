import nodemailer from "nodemailer";
import { otpEmailTemplate } from "./otpEmailTemplate.js";

export const sendOtpEmail = async (email, otp) => {
  // Check if environment variables are loaded (Critical for production/Render)
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.error("❌ CRITICAL: EMAIL_USER or EMAIL_PASS environment variable is missing!");
    throw new Error("Email server configuration is missing in production environment.");
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  console.log(`\n\n[DEV MODE] 🔴 OTP for ${email} is: ${otp}\n\n`);

  try {
    await transporter.sendMail({
      from: `"Glow & Grace" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "🔐 Your OTP Verification Code",
      html: otpEmailTemplate(otp),
    });
    console.log(`✅ OTP email successfully sent to ${email}`);
  } catch (error) {
    console.error("❌ NODEMAILER ERROR:", error);
    throw new Error(`Failed to send email: ${error.message}`);
  }
};