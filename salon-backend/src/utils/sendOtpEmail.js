import nodemailer from "nodemailer";
import { otpEmailTemplate } from "./otpEmailTemplate.js";

export const sendOtpEmail = async (email, otp) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  console.log(`\n\n[DEV MODE] 🔴 OTP for ${email} is: ${otp}\n\n`);

  await transporter.sendMail({
    from: `"Glow & Grace" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "🔐 Your OTP Verification Code",
    html: otpEmailTemplate(otp),
  });
};