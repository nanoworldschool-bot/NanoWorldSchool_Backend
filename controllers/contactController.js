import { sendAdmissionEmails } from '../utils/emailService.js';
import Enquiry from '../models/Enquiry.js';

export const sendContactEmail = async (req, res) => {
  const { name, email, phone, grade, message } = req.body;

  try {
    // 1. Save to MongoDB (Critical)
    const newEnquiry = new Enquiry({ name, email, phone, grade, message });
    await newEnquiry.save();

    // 2. Trigger Emails (Non-critical, don't crash if it fails)
    try {
      await sendAdmissionEmails({ name, email, phone, grade, message });
    } catch (emailError) {
      console.error('[Email Error] Failed to send admission notifications:', emailError.message);
      // We continue since the data is safely in the database
    }
    
    res.status(200).json({ 
      success: true, 
      message: 'Thank you! Your enquiry has been received successfully.' 
    });
  } catch (error) {
    console.error('[Contact Form Error] Critical failure:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Our system is temporarily unavailable. Please try again later or call us directly.' 
    });
  }
};
