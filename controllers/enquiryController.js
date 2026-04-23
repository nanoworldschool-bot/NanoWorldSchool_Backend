import Enquiry from '../models/Enquiry.js';
import { sendAdmissionEmails } from '../utils/emailService.js';

export const getEnquiries = async (req, res) => {
  try {
    const data = await Enquiry.find().sort({ createdAt: -1 });
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createEnquiry = async (req, res) => {
  try {
    const newEnquiry = new Enquiry(req.body);
    await newEnquiry.save();

    // Trigger Email
    await sendAdmissionEmails(req.body);

    res.status(201).json(newEnquiry);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


export const deleteEnquiry = async (req, res) => {
  try {
    await Enquiry.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Enquiry deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const handleBrochureRequest = async (req, res) => {
  try {
    const { name, email, phone, brochureType } = req.body;
    const newEnquiry = new Enquiry({
      name,
      email,
      phone,
      subject: `Brochure Request: ${brochureType}`,
      message: `User requested the official ${brochureType}.`,
      type: 'brochure'
    });
    await newEnquiry.save();

    // Trigger Email
    await sendAdmissionEmails({
      name,
      email,
      phone,
      grade: 'N/A',
      message: `User requested the official ${brochureType}.`
    });

    res.status(201).json({ message: 'Request saved successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
