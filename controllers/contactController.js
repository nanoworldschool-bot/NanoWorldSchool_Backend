import transporter from '../config/nodemailer.js';
import { adminEnquiryTemplate, parentAutoReplyTemplate } from '../utils/emailTemplates.js';
import Enquiry from '../models/Enquiry.js';
import dotenv from 'dotenv';

dotenv.config();

export const sendContactEmail = async (req, res) => {
  const { name, email, phone, grade, message } = req.body;

  try {
    // 1. Save to MongoDB
    const newEnquiry = new Enquiry({ name, email, phone, grade, message });
    await newEnquiry.save();

    // 2. Prepare Email Options
    const adminMailOptions = {
      from: `"Nano World School" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: `[New Enquiry] ${name} - Grade ${grade}`,
      html: adminEnquiryTemplate({ name, email, phone, grade, message })
    };

    const parentMailOptions = {
      from: `"Admissions | Nano World School" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `Thank you for your interest in Nano World School`,
      html: parentAutoReplyTemplate(name)
    };

    // 3. Send both emails
    await Promise.all([
      transporter.sendMail(adminMailOptions),
      transporter.sendMail(parentMailOptions)
    ]);
    
    res.status(200).json({ success: true, message: 'Enquiry received and confirmation sent.' });
  } catch (error) {
    console.error('Contact Form Error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to process enquiry. Please try again later.' 
    });
  }
};
