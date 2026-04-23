import { sendAdmissionEmails } from '../utils/emailService.js';
import Enquiry from '../models/Enquiry.js';

export const sendContactEmail = async (req, res) => {
  const { name, email, phone, grade, message } = req.body;

  try {
    // 1. Save to MongoDB
    const newEnquiry = new Enquiry({ name, email, phone, grade, message });
    await newEnquiry.save();

    // 2. Trigger Emails
    await sendAdmissionEmails({ name, email, phone, grade, message });
    
    res.status(200).json({ success: true, message: 'Enquiry received and confirmation sent.' });
  } catch (error) {
    console.error('Contact Form Error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to process enquiry. Please try again later.' 
    });
  }
};
