import transporter from '../config/nodemailer.js';
import { adminEnquiryTemplate, parentAutoReplyTemplate, forgotPasswordTemplate, invitationTemplate } from './emailTemplates.js';
import dotenv from 'dotenv';

dotenv.config();

// Helper function to send emails
const sendEmail = async (options) => {
  try {
    const info = await transporter.sendMail({
      from: `"Nano World School" <${process.env.EMAIL_USER}>`,
      ...options
    });
    console.log(`✉️ Email sent: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error(`❌ Email Send Failed: ${error.message}`);
    throw new Error(`Email delivery failed: ${error.message}`);
  }
};

export const sendAdmissionEmails = async (data) => {
  console.log(`[Email] Preparing admission emails for: ${data.email}`);
  
  const adminMailOptions = {
    to: process.env.EMAIL_USER,
    subject: `[New Enquiry] ${data.name} - Grade ${data.grade || 'N/A'}`,
    html: adminEnquiryTemplate(data)
  };

  const parentMailOptions = {
    from: `"Admissions | Nano World School" <${process.env.EMAIL_USER}>`,
    to: data.email,
    subject: `Thank you for your interest in Nano World School`,
    html: parentAutoReplyTemplate(data.name)
  };

  return await Promise.all([
    sendEmail(adminMailOptions),
    sendEmail(parentMailOptions)
  ]);
};

export const sendPasswordResetEmail = async (email, name, resetLink) => {
  console.log(`[Email] Preparing password reset for: ${email}`);
  
  const mailOptions = {
    from: `"IT Support | Nano World School" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: `Password Reset Request - Nano World School`,
    html: forgotPasswordTemplate(name, resetLink)
  };

  return await sendEmail(mailOptions);
};

export const sendInvitationEmail = async (email, tempPassword, setupLink) => {
  console.log(`[Email] Preparing invitation for: ${email}`);
  
  const mailOptions = {
    from: `"System Admin | Nano World School" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: `Invitation to Admin Portal - Nano World School`,
    html: invitationTemplate(email, tempPassword, setupLink)
  };

  return await sendEmail(mailOptions);
};
