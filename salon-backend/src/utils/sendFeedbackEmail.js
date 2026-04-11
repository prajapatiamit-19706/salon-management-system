import nodemailer from "nodemailer";
import { feedbackEmailTemplate } from "./feedbackEmailTemplate.js";

export const sendFeedbackEmail = async (email, feedbackDetails) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  console.log(
    `\n\n[DEV MODE] 🔴 Feedback request sent to ${email} for appointment ${feedbackDetails.appointmentId}\n\n`
  );

  await transporter.sendMail({
    from: `"Glow & Grace" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "⭐ How was your visit? Share your feedback!",
    html: feedbackEmailTemplate(feedbackDetails),
  });
};
