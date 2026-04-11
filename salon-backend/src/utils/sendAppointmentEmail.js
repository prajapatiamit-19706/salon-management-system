import nodemailer from "nodemailer";
import { appointmentEmailTemplate } from "./appointmentEmailTemplate.js";

export const sendAppointmentEmail = async (email, appointmentDetails) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  console.log(`\n\n[DEV MODE] 🔴 Appointment confirmation sent to ${email} for ${appointmentDetails.serviceName}\n\n`);

  await transporter.sendMail({
    from: `"Glow & Grace" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "✨ Your Appointment is Confirmed",
    html: appointmentEmailTemplate(appointmentDetails),
  });
};
