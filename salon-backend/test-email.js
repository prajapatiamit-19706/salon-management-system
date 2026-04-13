import sgMail from '@sendgrid/mail';
import dotenv from 'dotenv';
dotenv.config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const msg = {
  from: '"Glow & Grace" <' + process.env.EMAIL_USER + '>',
  to: process.env.EMAIL_USER,
  subject: 'Test Email',
  text: 'This is a test email',
  html: '<strong>This is a test email</strong>',
};

console.log("Sending email from:", msg.from);
sgMail
  .send(msg)
  .then(() => {
    console.log('Email sent');
  })
  .catch((error) => {
    console.error('Error string format:');
    console.error(error.response.body);
  });
