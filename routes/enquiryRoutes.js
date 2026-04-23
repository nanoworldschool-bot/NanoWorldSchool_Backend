import express from 'express';
import { getEnquiries, createEnquiry, deleteEnquiry, handleBrochureRequest } from '../controllers/enquiryController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, getEnquiries);
router.post('/', createEnquiry);
router.post('/brochure', handleBrochureRequest);
router.delete('/:id', protect, deleteEnquiry);

export default router;

